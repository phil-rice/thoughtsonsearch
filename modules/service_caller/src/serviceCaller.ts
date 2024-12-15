import {AsyncErrorCall2, ErrorsOr, isErrors} from "@enterprise_search/errors";
import {NameAnd} from "@enterprise_search/recoil_utils";
import {DebugContext} from "@enterprise_search/debug";

export type ServiceApiContext = DebugContext & {
    serviceCaller: ServiceCaller<any, any>
}
// Type class around fetch, axios, or any other library that retrieves data.
// This wrapper allows upgrading to the latest versions of these libraries quickly and safely.
// It abstracts the common request-response logic, making it easier to work with different HTTP libraries.
// The goal is to simplify handling domain requests and responses in a way that's flexible and reusable.

export type Method = 'Post' | 'Get' | 'Put' | 'Delete'; // Added PUT and DELETE for completeness
export type Header = string | string[] | undefined;
export type Headers = NameAnd<Header>

export type ServiceRequestTC<Req> = {
    // Handles transforming the request into a specific format (e.g., setting method, url, headers)
    call(context: DebugContext, method: Method, url: string, body: string | undefined, headers: Headers): Req;
};

export type ServiceResponseTC<Res> = {
    // Handles extracting the status, body text, and headers from the response
    status(res: Res): number;
    text(res: Res): Promise<string>;
    header(res: Res, header: string): Header;
    headernames(res: Res): string[];
};

export type ServiceCaller<Req, Res> = {
    // Performs the actual request based on the provided service logic
    fetch: (context: DebugContext, req: Req) => Promise<Res>;
    reqTC: ServiceRequestTC<Req>;
    resTC: ServiceResponseTC<Res>;
};

// The Context provides access to security headers and other contextual data (e.g., preferences).
export type DomainRequestCaller<Context, From> = {
    // Function to validate the "From" context before making a request
    validateFrom?: (context: Context, from: From) => string[];

    // Function to determine the HTTP method for the request
    method: (context: Context, from: From) => Method;

    // Function to determine the URL for the request
    url: (context: Context, from: From) => string;

    // Optionally add headers for the request. It's a promise because sometimes we need to go get an access token and that can take time
    headers?: (context: Context, from: From) => Promise<NameAnd<string>>;

    // Optionally add a body for the request
    body?: (context: Context, from: From) => string;
};

export type ResultMaker<Context, From, To> = {
    // List of headers to check for validity in the response
    headersToCheck?: string[];

    // Function to check if the response is "OK" (validates the response headers)
    ok?: (status: number, headers: Headers) => string[];

    // Function to parse the response and handle any errors or validation. The url is just for error messages
    toJson?: <Res>(resTC: ServiceResponseTC<Res>, context: Context, url: string, res: Res) => Promise<ErrorsOr<any>>;

    // Optionally validates the transformed response data before returning. We need the headers as sometimes they impact the response
    validateTo?: (context: Context, from: From, headers: Headers, value: unknown) => ErrorsOr<To>;

    // Handles errors from the request or transformation.
    handleError?: (context: Context, from: From, error: unknown) => ErrorsOr<To>;
};
export type DomainCaller<Context, From, To> = DomainRequestCaller<Context, From> & ResultMaker<Context, From, To>

function getHeadersForResultMaker<Res>(headersToCheck: string[], resTC: ServiceResponseTC<Res>, res: Res): NameAnd<Header> {
    const result: NameAnd<Header> = {};
    for (const header of headersToCheck)
        result[header] = resTC.header(res, header);
    return result;
}

export function defaultOk(status: number) {
    if (status / 100 === 2) return []
    return [`invalid status code. Expected 2xx got ${status}`]
}

function defaultHandleError<Context, From, To>(context: Context, from: From, error: any): ErrorsOr<To> {
    if (error.message)
        return {errors: [`Unexpected error ${error.message}`]}
    else
        return {errors: [`Unexpected error ${JSON.stringify(error)}`]}
}

export async function defaultToJson<Context, Res>(resTC: ServiceResponseTC<Res>, context: Context, url: string, res: Res): Promise<ErrorsOr<any>> {
    try {
        const s = await resTC.text(res)
        if (s === '') return {value: {}}
        try {
            return {value: JSON.parse(s)}
        } catch (e: any) {
            return {errors: [`Unexpected error parsing json returned from ${url}. ${e.message}\n${s}`]}
        }
    } catch (e: any) {
        return {errors: [`Unexpected error parsing json returned from ${url}. ${JSON.stringify(e)}`]}
    }
}


// Main function to handle making a request and processing the response, including validation and error handling
export const serviceCall = <Req, Res>({reqTC, resTC, fetch}: ServiceCaller<Req, Res>) =>
    <Context extends ServiceApiContext, From, To>({
                                                      method = () => 'Get',
                                                      headers = async () => ({}),
                                                      body = () => '',
                                                      url,
                                                      validateFrom = () => [], // Default empty validation function for "from" context
                                                  }: DomainRequestCaller<Context, From>,
                                                  {
                                                      ok = defaultOk,
                                                      toJson = defaultToJson,
                                                      validateTo = (context, from, headers, value) => ({value: value as To}),
                                                      headersToCheck = [],
                                                      handleError = defaultHandleError,
                                                  }: ResultMaker<Context, From, To>): AsyncErrorCall2<Context, From, To> => {

        return async (context: Context, from: From): Promise<ErrorsOr<To>> => {
            // Validate the "from" context before making the request
            const fromErrors = validateFrom(context, from);
            if (fromErrors.length > 0) return {errors: fromErrors};

            // Prepare the request based on the domain logic
            const theUrl = url(context, from);
            const req: Req = reqTC.call(context, method(context, from), theUrl, body(context, from), await headers(context, from));

            try {
                const res: Res = await fetch(context, req);

                let resultHeadersWeCareAbout = getHeadersForResultMaker(headersToCheck, resTC, res);
                const okErrors = ok(resTC.status(res), resultHeadersWeCareAbout);
                if (okErrors.length > 0) return {errors: okErrors};

                const candidate = await toJson(resTC, context, theUrl, res);
                if (isErrors(candidate)) return candidate
                const validate = validateTo(context, from, resultHeadersWeCareAbout, candidate.value);
                return validate;
            } catch (e: any) {
                return handleError(context, from, e);
            }
        };
    };

