import {Headers, ServiceRequest} from "@enterprise_search/service_caller"

export type Authentication = {
    name: string
    modifyUrl?: (url: string) => Promise<string>;
    modifyBody?: (body: any) => Promise<any>;
    modifyHeaders?: (headers: Headers) => Promise<Headers>;
}

export async function applyAuthentication<T>(auth: Authentication, req: ServiceRequest<T>): Promise<ServiceRequest<T>> {
    const {url, body, headers} = req
    return {
        ...req,
        url: auth.modifyUrl ? await auth.modifyUrl(url) : url,
        body: auth.modifyBody ? await auth.modifyBody(body) : body,
        headers: auth.modifyHeaders ? await auth.modifyHeaders(headers) : headers
    }
}
export const emptyAuthentication: Authentication = {
    name: 'empty',
}
export const testAuthentication: Authentication = {
    name: 'test',
    modifyHeaders: async (headers: Headers) => ({...headers, 'x-test': 'test'}),
    modifyUrl: async (url: string) => `${url}?test=test`,
    modifyBody: async (body: any) => ({...body, test: 'test'})
}

export const basicAuthentication = (username: string, password: string): Authentication => ({
    name: 'basic',
    modifyHeaders: async (headers: Headers) =>
        ({...headers, Authorization: `Basic ${(Buffer.from(`${username}:${password}`).toString('base64'))}`})
});

export const bearerAuthentication = (token: string): Authentication => ({
    name: 'bearer',
    modifyHeaders: async (headers: Headers) =>
        ({...headers, Authorization: `Bearer ${token}`})
})

export const bearerAuthenticationFromFn = (token: () => Promise<string>): Authentication => ({
    name: 'bearerFromFn',
    modifyHeaders: async (headers: Headers) =>
        ({...headers, Authorization: `Bearer ${await token()}`})
})

