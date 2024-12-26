import {Headers} from "@enterprise_search/service_caller"

export type Authentication = {
    name: string
    modifyUrl?: (url: string) => Promise<string>;
    modifyBody?: (body: any) => Promise<any>;
    modifyHeaders?: (headers: Headers) => Promise<Headers>;
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

