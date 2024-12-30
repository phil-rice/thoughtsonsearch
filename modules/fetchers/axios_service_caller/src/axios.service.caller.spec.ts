import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { axiosServiceCaller, AxiosContext } from './axios.service.caller';
import {stringParserAndValidator, ServiceRequest, ServiceResponse, justValidator} from '@enterprise_search/service_caller';
import { ErrorsOr, errorsOrThrow } from '@enterprise_search/errors';
import { createMockDebugLog } from '@enterprise_search/recoil_utils';
import { emptyAuthentication, testAuthentication } from '@enterprise_search/authentication';

const mock = new MockAdapter(axios);
const debugMock = createMockDebugLog();
const axiosContext: AxiosContext = {
    authentication: emptyAuthentication,
    debug: debugMock,
    axiosConfig: {}
};

describe('axiosServiceCaller - Successful Calls', () => {
    const serviceRequest: ServiceRequest = {
        method: 'GET',
        url: 'https://example.com/api',
        headers: { Authorization: 'Bearer token' }
    };

    afterEach(() => {
        mock.reset();
        jest.clearAllMocks();
    });

    it('returns a successful response with string body', async () => {
        const mockResponse = {
            status: 200,
            data: 'Success',
            headers: { 'x-correlation-id': '12345' }
        };
        mock.onGet(serviceRequest.url).reply(
            mockResponse.status,
            mockResponse.data,
            mockResponse.headers
        );

        const result: ErrorsOr<ServiceResponse<string>> = await axiosServiceCaller(axiosContext, serviceRequest);

        expect(result).toEqual({
            value: {
                status: mockResponse.status,
                body: 'Success',
                headers: mockResponse.headers
            }
        });
    });

    it('returns a successful response with parsed JSON', async () => {
        const jsonBody = { foo: 'bar' };
        const mockResponse = {
            status: 200,
            data: JSON.stringify(jsonBody),
            headers: { 'x-correlation-id': '12345' }
        };
        mock.onGet(serviceRequest.url).reply(
            mockResponse.status,
            mockResponse.data,
            mockResponse.headers
        );

        const result: ErrorsOr<ServiceResponse<{ foo: string }>> = await axiosServiceCaller(
            axiosContext,
            { ...serviceRequest, parser: justValidator<{ foo: string }>() }
        );

        expect(result).toEqual({
            value: {
                status: mockResponse.status,
                body: jsonBody,
                headers: mockResponse.headers
            }
        });
    });
});

describe('axiosServiceCaller - Error Handling', () => {
    const serviceRequest: ServiceRequest = {
        method: 'GET',
        headers: {some: 'header'},
        url: 'https://example.com/api'
    };

    afterEach(() => {
        mock.reset();
        jest.clearAllMocks();
    });

    it('handles 404 error responses', async () => {
        const mockErrorResponse = {
            status: 404,
            data: { error: 'Not Found' },
            headers: {}
        };
        mock.onGet(serviceRequest.url).reply(
            mockErrorResponse.status,
            mockErrorResponse.data,
            mockErrorResponse.headers
        );

        const result: ErrorsOr<ServiceResponse> = await axiosServiceCaller(axiosContext, serviceRequest);

        expect(result).toEqual({
            errors: ['HTTP 404: undefined'],
            extras: { sr: serviceRequest, text: mockErrorResponse.data }
        });
    });

    it('handles network errors', async () => {
        mock.onGet(serviceRequest.url).networkError();

        const result: ErrorsOr<ServiceResponse> = await axiosServiceCaller(axiosContext, serviceRequest);

        expect(result).toEqual({
            errors: [  "Network Error"],
            extras: { sr: serviceRequest }
        });
    });

    it('handles unexpected errors', async () => {
        const unexpectedError = new Error('Unexpected error');
        mock.onGet(serviceRequest.url).reply(() => {
            throw unexpectedError;
        });

        const result: ErrorsOr<ServiceResponse> = await axiosServiceCaller(axiosContext, serviceRequest);

        expect(result).toEqual({
            errors: [unexpectedError.message],
            extras: { sr: serviceRequest }
        });
    });

    it('applies authentication', async () => {
        const axiosContextWithAuth: AxiosContext = {
            ...axiosContext,
            authentication: testAuthentication,
        };

        const mockResponse = {
            status: 200,
            data: { message: 'Success' },
            headers: { 'x-correlation-id': '12345' }
        };

        mock.onGet('https://example.com/api?test=test').reply(
            mockResponse.status,
            mockResponse.data,
            mockResponse.headers
        );

        const result: ErrorsOr<ServiceResponse> = await axiosServiceCaller(axiosContextWithAuth, serviceRequest);

        expect(result).toEqual({
            value: {
                status: mockResponse.status,
                body: mockResponse.data,
                headers: mockResponse.headers
            }
        });

        const requestHistory = mock.history.get[0];
        expect(requestHistory.url).toBe('https://example.com/api?test=test');
        expect(requestHistory.headers['x-test']).toBe('test');
    });
});
