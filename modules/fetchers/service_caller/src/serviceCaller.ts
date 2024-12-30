import {AsyncErrorCall2} from "@enterprise_search/errors";
import {NameAnd} from "@enterprise_search/recoil_utils";

/* A lightweight wrapper around axios or fetch. Allows us to change how we do this, decouple ourselves from the library */
export type ServiceCaller<Context> = AsyncErrorCall2<Context, ServiceRequest, ServiceResponse>

export type Method = 'POST' | 'GET' | 'PUT' | 'DELETE';
export type Header = string | string[] | undefined;
export type Headers = NameAnd<Header>

export type ServiceRequest = {
    method: Method
    url: string
    body?: string
    headers: Headers
}
export type ServiceResponse = {
    status: number
    headers: Headers
    body: string
}

