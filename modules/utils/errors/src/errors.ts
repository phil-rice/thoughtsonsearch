import {NameAnd} from "@laoban/utils";

export type Value<T> = { value: T }

export function isValue<T>(e: ErrorsOr<T>): e is Value<T> {
    return (e as any)?.value !== undefined
}

export function valueOrThrow<T>(e: ErrorsOr<T>): T {
    if (isErrors(e)) throw new Error(e.errors.join(','))
    return e.value
}

export const valueOrDefault = <T>(e: ErrorsOr<T>, defaultValue: T): T =>
    isErrors(e) || !e ? defaultValue : e.value;

export function partitionNameAndErrorsOr<T>(es: NameAnd<ErrorsOr<T>>) {
    const values: NameAnd<T> = {}
    const errors: string[] = []
    for (const [name, value] of Object.entries(es)) {
        if (isValue(value)) values[name] = value.value
        else errors.push(...value.errors)
    }
    return {values, errors}
}

export type Errors = { errors: string[] }

export function errorsOrThrow<T>(e: ErrorsOr<T>): Errors {
    if (isValue(e)) throw new Error(`Expected errors but got value ${JSON.stringify(e)}`)
    return e
}

export function isErrors<T>(e: ErrorsOr<T>): e is Errors {
    return (e as any).errors !== undefined

}

export type ErrorsOr<T> = Errors | Value<T>
export function recover<T>(e: ErrorsOr<T>, f: (e: Errors) => T):T {
    if (isErrors(e)) return f(e)
    return e.value
}
export function mapErrorsOr<T, T1>(e: ErrorsOr<T>, f: (t: T) => T1): ErrorsOr<T1> {
    if (isValue(e)) return {value: f(e.value)}
    return e
}
export function flatMapErrorsOr<T, T1>(e: ErrorsOr<T>, f: (t: T) => ErrorsOr<T1>): ErrorsOr<T1> {
    if (isValue(e)) return f(e.value)
    return e
}

export async function mapErrorsOrK<T, T1>(e: ErrorsOr<T>, f: (t: T) => Promise<T1>):Promise<ErrorsOr<T1>> {
    if (isValue(e)) return {value: await f(e.value)}
    return e
}
export async function flatMapErrorsOrK<T, T1>(e: ErrorsOr<T>, f: (t: T) => Promise<ErrorsOr<T1>>):Promise<ErrorsOr<T1>> {
    if (isValue(e)) return await f(e.value)
    return e
}

export type AsyncErrorCall<From, To> = (from: From) => Promise<ErrorsOr<To>>
export type AsyncErrorCall2<From1, From2, To> = (from1: From1, from2: From2) => Promise<ErrorsOr<To>>

