import {ErrorsOr, flatMapErrorsOr} from "@enterprise_search/errors";
import {NameAnd} from "@enterprise_search/recoil_utils";

export type ServiceCaller<Context> = <T, >(context: Context,serviceRequest: ServiceRequest<T>) => Promise<ErrorsOr<ServiceResponse<T>>>

export type Method = 'POST' | 'GET' | 'PUT' | 'DELETE';
export type Header = string | string[] | undefined;
export type Headers = NameAnd<Header>;

export type ServiceRequest<T = string> = {
    method: Method;
    url: string;
    body?: string;
    headers: Headers;
    parser?: ParserAndValidator<T>;
};

export type ServiceResponse<T = string> = {
    status: number;
    headers: Headers;
    body: T;
};

//sometimes S will be a string. Sometimes a json object. The caller should know what it expects.
export type ParserAndValidator<T> = {
    parser: (s: any, status: number) => ErrorsOr<T>;
    validator: (t: unknown) => string[];
};


const defaultCopyParser: ParserAndValidator<string> = {
    parser: (s: any, status) => {
        if (status >= 200 && status < 300) {
            return {value: s};
        } else if (status === 404) {
            return {value: undefined};
        } else
            return {errors: [`Unexpected status code: ${status}`], extras: {status, body: s}};
    },
    validator: () => [] // No validation required for plain strings
};


export function makeServiceResponse<T = string>(
    status: number,
    headers: Headers,
    body: string | undefined,
    parser?: ParserAndValidator<T>
): ErrorsOr<ServiceResponse<T>> {
    const actualParser = parser ?? defaultCopyParser as unknown as ParserAndValidator<T>;

    const {validator, parser: parserFn} = actualParser;
    return flatMapErrorsOr(parserFn(body, status), (value) => {
        const errors = validator(value);
        if (errors.length > 0) return {errors, extras: {status, headers, body}};
        const serviceResponse: ServiceResponse<T> = {body: value, headers, status};
        return {value: serviceResponse};
    });
}

// ---- JSON Parser with Validation ----

export const jsonParser = (
    s: string,
    status: number
): ErrorsOr<any> => {
    try {
        const value = JSON.parse(s);
        return {value};
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : JSON.stringify(e);
        return {errors: [message], extras: {s, status}};
    }
};

// ---- Parser and Validator Factory ----

export function stringParserAndValidator<T>(
    validator?: (a: unknown) => string[]
): ParserAndValidator<T> {
    const actualValidator = validator ?? (() => []);
    return {
        parser: jsonParser,
        validator: actualValidator,
    };
}

export function justValidator<T>(
    validator?: (a: unknown) => string[]
): ParserAndValidator<T> {
    const actualValidator = validator ?? (() => []);
    return {
        parser: (s: any, status: number) => ({value: s}),
        validator: actualValidator,
    };
}
