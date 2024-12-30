import axios, {AxiosError, AxiosRequestConfig} from 'axios';
import {Errors, ErrorsOr} from "@enterprise_search/errors";
import {ServiceCaller, ServiceRequest, ServiceResponse} from "@enterprise_search/service_caller";

import {DebugLog, NameAnd} from "@enterprise_search/recoil_utils";

import {applyAuthentication, Authentication} from "@enterprise_search/authentication";

export type AxiosContext = {
    debug: DebugLog,
    axiosConfig: AxiosRequestConfig;
    authentication: Authentication
}

export const axiosServiceCaller: ServiceCaller<AxiosContext> =  async (
    {axiosConfig, debug, authentication}: AxiosContext,
    req: ServiceRequest,
): Promise<ErrorsOr<ServiceResponse>> => {
    try {
        debug('serviceCaller - req', req);
        const withAuth = await applyAuthentication(authentication, req)
        const response = await axios({
            ...axiosConfig,
            method: withAuth.method,
            url: withAuth.url,
            data: withAuth.body,
            headers: withAuth.headers || {},
        });
        const responseHeaders: NameAnd<string> = {}
        for (const [key, value] of Object.entries(response?.headers || {}))
            responseHeaders[key] = Array.isArray(value) ? value.join(',') : value.toString()
        const sr: ServiceResponse = {status: response.status, body: response.data, headers: responseHeaders};
        debug('serviceCaller - res', sr);
        return {value: sr}
    } catch (error: any) {
        const result: Errors = handleAxiosError(req, error);
        debug.debugError(error, 'serviceCaller - error', result);
        return result;
    }
};

function handleAxiosError(sr: ServiceRequest, error: AxiosError): Errors {
    if (error.response) {
        // Server responded with a status other than 2xx
        return {
            errors: [`HTTP ${error.response.status}: ${error.response.statusText}`],
            extras: {sr, 'text': error.response.data},
            reference: error.response.headers['x-correlation-id'] || undefined
        };
    } else if (error.request) {
        // Request was made but no response received
        return {
            errors: ['No response received from server'],
            extras: {sr, request: error.request}
        };
    } else {
        // Something happened in setting up the request
        return {
            errors: [error.message],
            extras: {sr}
        };
    }
}
