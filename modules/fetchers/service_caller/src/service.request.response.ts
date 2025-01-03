import {Headers, Method, ServiceRequestTC, ServiceResponseTC} from "./serviceCaller";
import {DebugContext} from "@enterprise_search/debug";

//these classes exist to allow us to write tests without needing a concrete service caller. i.e. without fetch or node-fetch or axios

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


export const ServiceRequestTcForServiceRequest: ServiceRequestTC<ServiceRequest> = {
    call: (context: DebugContext, method: Method, url: string, body: string | undefined, headers: Headers): ServiceRequest =>
        ({method, url, body, headers})
}

export const ServiceResponseTcForServiceResponse: ServiceResponseTC<ServiceResponse> = {
    status: (res: ServiceResponse): number => res.status,
    header: (res: ServiceResponse, header: string) => res.headers[header],
    headernames: (res: ServiceResponse): string[] => Object.keys(res.headers),
    text: async (res: ServiceResponse) => res.body
}