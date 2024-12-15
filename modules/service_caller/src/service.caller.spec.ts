import {DomainRequestCaller, ResultMaker, serviceCall, ServiceCallDebug, ServiceCaller} from "./serviceCaller";
import {ServiceRequest, ServiceRequestTcForServiceRequest, ServiceResponse, ServiceResponseTcForServiceResponse} from "./service.request.response";
import {errorsOrThrow, valueOrThrow} from "@enterprise_search/errors";


type DomainRequest = {
    msg: string
}
type DomainResponse = {
    resp: string
}
type DomainContext = {
    language: string
    debug?: ServiceCallDebug
}
const domainCaller: DomainRequestCaller<DomainContext, DomainRequest> = {
    url: (c, from) => `${c.language}/${from.msg}`,
    body: (c, from) => `lang:${c.language} msg:${from.msg}`,
    headers: (c, from) => ({lang: c.language, msg: from.msg}),
    method: () => 'Post',
}
const domainCallerWithValidator: DomainRequestCaller<DomainContext, DomainRequest> = {
    ...domainCaller,
    validateFrom: (c, from) => {
        return from.msg.includes('bad') ? ['bad message'] : [];
    }
}
const context: DomainContext = {
    language: 'de',
    debug: {serviceDebug: true, serviceHeadersDebug: false}
}
const domainRequest: DomainRequest = {msg: 'hello'}

const defaultResultMaker: ResultMaker<DomainContext, DomainRequest, DomainResponse> = {}
describe("service caller", () => {
    it("should send a domain request object and get back a domain response object", async () => {
        const fetch = jest.fn()
        const serviceRequest: ServiceRequest = {method: 'Post', url: 'de/hello', body: 'lang:de msg:hello', headers: {lang: 'de', msg: 'hello'}}
        const serviceResponse: ServiceResponse = {status: 200, body: JSON.stringify({msg: 'goodbye'}), headers: {some: 'headerValue'}}
        fetch.mockResolvedValueOnce(serviceResponse);
        const serviceCaller: ServiceCaller<ServiceRequest, ServiceResponse> = {fetch, reqTC: ServiceRequestTcForServiceRequest, resTC: ServiceResponseTcForServiceResponse}

        const domainResponse = valueOrThrow(await serviceCall(serviceCaller)(domainCaller, context, defaultResultMaker)(domainRequest))

        expect(domainResponse).toEqual({msg: 'goodbye'})
        expect(fetch).toHaveBeenCalledWith(serviceRequest, context.debug)
        expect(fetch).toHaveBeenCalledTimes(1)
    })

    it("should report a json parse error", async () => {
        const fetch = jest.fn()
        const serviceRequest: ServiceRequest = {method: 'Post', url: 'de/hello', body: 'lang:de msg:hello', headers: {lang: 'de', msg: 'hello'}}
        const serviceResponse: ServiceResponse = {status: 200, body: 'not json', headers: {some: 'headerValue'}}
        fetch.mockResolvedValueOnce(serviceResponse);
        const serviceCaller: ServiceCaller<ServiceRequest, ServiceResponse> = {fetch, reqTC: ServiceRequestTcForServiceRequest, resTC: ServiceResponseTcForServiceResponse}

        const domainResponse = await serviceCall(serviceCaller)(domainCaller, context, defaultResultMaker)(domainRequest)

        expect(domainResponse).toEqual({
            "errors": ["Unexpected error parsing json returned from de/hello. Unexpected token 'o', \"not json\" is not valid JSON\nnot json"]
        })
        expect(fetch).toHaveBeenCalledWith(serviceRequest, context.debug)
        expect(fetch).toHaveBeenCalledTimes(1)
    })
    it('should return an empty json object if the body is empty', async () => {
        const fetch = jest.fn()
        const serviceRequest: ServiceRequest = {method: 'Post', url: 'de/hello', body: 'lang:de msg:hello', headers: {lang: 'de', msg: 'hello'}}
        const serviceResponse: ServiceResponse = {status: 200, body: '', headers: {some: 'headerValue'}}
        fetch.mockResolvedValueOnce(serviceResponse);
        const serviceCaller: ServiceCaller<ServiceRequest, ServiceResponse> = {fetch, reqTC: ServiceRequestTcForServiceRequest, resTC: ServiceResponseTcForServiceResponse}

        const domainResponse = valueOrThrow(await serviceCall(serviceCaller)(domainCaller, context, defaultResultMaker)(domainRequest))

        expect(domainResponse).toEqual({})
        expect(fetch).toHaveBeenCalledWith(serviceRequest, context.debug)
        expect(fetch).toHaveBeenCalledTimes(1)
    })
    it('should report an error if the status is not 2xx', async () => {
        const fetch = jest.fn()
        const serviceRequest: ServiceRequest = {method: 'Post', url: 'de/hello', body: 'lang:de msg:hello', headers: {lang: 'de', msg: 'hello'}}
        const serviceResponse: ServiceResponse = {status: 500, body: 'error', headers: {some: 'headerValue'}}
        fetch.mockResolvedValueOnce(serviceResponse);
        const serviceCaller: ServiceCaller<ServiceRequest, ServiceResponse> = {fetch, reqTC: ServiceRequestTcForServiceRequest, resTC: ServiceResponseTcForServiceResponse}

        const domainResponse = await serviceCall(serviceCaller)(domainCaller, context, defaultResultMaker)(domainRequest)

        expect(domainResponse).toEqual({"errors": ["invalid status code. Expected 2xx got 500"]})

    })
    it('should validate the response if the validatorFrom is provided - good value', async () => {
        const fetch = jest.fn()
        const serviceRequest: ServiceRequest = {method: 'Post', url: 'de/hello', body: 'lang:de msg:hello', headers: {lang: 'de', msg: 'hello'}}
        const serviceResponse: ServiceResponse = {status: 200, body: JSON.stringify({msg: 'goodbye'}), headers: {some: 'headerValue'}}
        fetch.mockResolvedValueOnce(serviceResponse);
        const serviceCaller: ServiceCaller<ServiceRequest, ServiceResponse> = {fetch, reqTC: ServiceRequestTcForServiceRequest, resTC: ServiceResponseTcForServiceResponse}

        const domainResponse = valueOrThrow(await serviceCall(serviceCaller)(domainCallerWithValidator, context, defaultResultMaker)(domainRequest))

        expect(domainResponse).toEqual({msg: 'goodbye'})
        expect(fetch).toHaveBeenCalledWith(serviceRequest, context.debug)
        expect(fetch).toHaveBeenCalledTimes(1)
    })
    it('should validate the response if the validatorFrom is provided - bad value', async () => {
        const fetch = jest.fn()
        const serviceRequest: ServiceRequest = {method: 'Post', url: 'de/hello', body: 'lang:de msg:hello', headers: {lang: 'de', msg: 'hello'}}
        const serviceResponse: ServiceResponse = {status: 200, body: JSON.stringify({msg: 'bad msg'}), headers: {some: 'headerValue'}}
        fetch.mockResolvedValueOnce(serviceResponse);
        const serviceCaller: ServiceCaller<ServiceRequest, ServiceResponse> = {fetch, reqTC: ServiceRequestTcForServiceRequest, resTC: ServiceResponseTcForServiceResponse}

        const domainResponse = errorsOrThrow(await serviceCall(serviceCaller)(domainCallerWithValidator, context, defaultResultMaker)({msg: 'bad'}))

        expect(domainResponse).toEqual({"errors": ["bad message"]})
        expect(fetch).toHaveBeenCalledTimes(0)
    })
    it('returns whatever the validate to tells it to', async () => {
        const fetch = jest.fn()
        const serviceRequest: ServiceRequest = {method: 'Post', url: 'de/hello', body: 'lang:de msg:hello', headers: {lang: 'de', msg: 'hello'}}
        const serviceResponse: ServiceResponse = {status: 200, body: JSON.stringify({msg: 'goodbye'}), headers: {some: 'headerValue'}}
        fetch.mockResolvedValueOnce(serviceResponse);
        const serviceCaller: ServiceCaller<ServiceRequest, ServiceResponse> = {fetch, reqTC: ServiceRequestTcForServiceRequest, resTC: ServiceResponseTcForServiceResponse}
        const resultMaker: ResultMaker<DomainContext, DomainRequest, DomainResponse> = {
            validateTo: (c, from, value) => {
                return {some: 'value'} as any
            }
        }

        const domainResponse = await serviceCall(serviceCaller)(domainCaller, context, resultMaker)(domainRequest)
        expect(domainResponse).toEqual({some: 'value'})
        expect(fetch).toHaveBeenCalledWith(serviceRequest, context.debug)
        expect(fetch).toHaveBeenCalledTimes(1)
    })

    it('has an isOK that receives defined headers and the status code', async () => {
        const fetch = jest.fn()
        const serviceRequest: ServiceRequest = {method: 'Post', url: 'de/hello', body: 'lang:de msg:hello', headers: {lang: 'de', msg: 'hello'}}
        const serviceResponse: ServiceResponse = {status: 200, body: JSON.stringify({msg: 'goodbye'}), headers: {some: 'headerValue', other: 'value'}}
        fetch.mockResolvedValueOnce(serviceResponse);
        const serviceCaller: ServiceCaller<ServiceRequest, ServiceResponse> = {fetch, reqTC: ServiceRequestTcForServiceRequest, resTC: ServiceResponseTcForServiceResponse}
        const resultMaker = {
            ...defaultResultMaker,
            headersToCheck: ['some'],
            ok: (status, headers) => [`received ${status} and ${JSON.stringify(headers)}`]
        }

        const domainResponse = errorsOrThrow(await serviceCall(serviceCaller)(domainCaller, context, resultMaker)(domainRequest))

        expect(domainResponse).toEqual({"errors": ["received 200 and {\"some\":\"headerValue\"}"]})
        expect(fetch).toHaveBeenCalledWith(serviceRequest, context.debug)
        expect(fetch).toHaveBeenCalledTimes(1)
    })

})