import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { ServiceRequest, ServiceResponse } from '@enterprise_search/service_caller';
import { AxiosContext, axiosServiceCaller } from './axios.service.caller';
import { ErrorsOr } from '@enterprise_search/errors';
import { createMockDebugLog } from '@enterprise_search/recoil_utils';
import { emptyAuthentication, testAuthentication } from '@enterprise_search/authentication';

const mock = new MockAdapter(axios);
const debugMock = createMockDebugLog();
const axiosContext: AxiosContext = {
    authentication: emptyAuthentication,
    debug: debugMock,
    axiosConfig: {}
};

describe('axiosServiceCaller', () => {
    const serviceRequest: ServiceRequest = {
        method: 'GET',
        url: 'https://example.com/api',
        headers: { Authorization: 'Bearer token' }
    };

    afterEach(() => {
        mock.reset();
        jest.clearAllMocks();
    });

    it('should return a successful response', async () => {
        const mockResponse = {
            status: 200,
            data: { message: 'Success' },
            headers: { 'x-correlation-id': '12345' }
        };
        mock.onGet(serviceRequest.url).reply(
            mockResponse.status,
            mockResponse.data,
            mockResponse.headers
        );

        const result: ErrorsOr<ServiceResponse> = await axiosServiceCaller(axiosContext, serviceRequest);

        expect(result).toEqual({
            value: {
                status: mockResponse.status,
                body: mockResponse.data,
                headers: mockResponse.headers
            }
        });

        // Assert debug log calls
        expect(debugMock).toHaveBeenNthCalledWith(1, 'serviceCaller - req', serviceRequest);
        expect(debugMock).toHaveBeenNthCalledWith(2, 'serviceCaller - res', {
            status: mockResponse.status,
            body: mockResponse.data,
            headers: mockResponse.headers
        });
    });

    it('should not modify the logs with the authentication', async () => {
        const axiosContextWithAuth: AxiosContext = {
            ...axiosContext,
            authentication: testAuthentication,
        };
        const mockResponse = {
            status: 200,
            data: { message: 'Success' },
            headers: { 'x-correlation-id': '12345' }
        };
        mock.onGet(serviceRequest.url).reply(
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

        // Assert debug log calls
        expect(debugMock).toHaveBeenNthCalledWith(1, 'serviceCaller - req', serviceRequest);
        expect(debugMock).toHaveBeenNthCalledWith(2, 'serviceCaller - res', {
            status: mockResponse.status,
            body: mockResponse.data,
            headers: mockResponse.headers
        });
    });

    it('should handle 404 error responses', async () => {
        const mockErrorResponse = {
            status: 404,
            statusText: 'Not Found', // Explicitly set statusText
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
            errors: [`HTTP ${mockErrorResponse.status}: undefined`], // undefined in the test. In reality it would be the status message
            extras: { sr: serviceRequest, text: mockErrorResponse.data },
            reference: undefined
        });
    });

    it('should handle network errors', async () => {
        mock.onGet(serviceRequest.url).networkError();

        const result: ErrorsOr<ServiceResponse> = await axiosServiceCaller(axiosContext, serviceRequest);

        expect(result).toEqual({
            errors: ['Network Error'],
            extras: { sr: serviceRequest }
        });

        // Assert debugError log call
        expect(debugMock.debugError).toHaveBeenCalledWith(
            expect.any(Error),
            'serviceCaller - error',
            {
                errors: ['Network Error'],
                extras: { sr: serviceRequest }
            }
        );
    });

    it('should handle unexpected errors', async () => {
        const unexpectedError = new Error('Unexpected error');
        mock.onGet(serviceRequest.url).reply(() => {
            throw unexpectedError;
        });

        const result: ErrorsOr<ServiceResponse> = await axiosServiceCaller(axiosContext, serviceRequest);

        expect(result).toEqual({
            errors: [unexpectedError.message],
            extras: { sr: serviceRequest }
        });

        // Assert debugError log call
        expect(debugMock.debugError).toHaveBeenCalledWith(
            unexpectedError,
            'serviceCaller - error',
            {
                errors: [unexpectedError.message],
                extras: { sr: serviceRequest }
            }
        );
    });

    it('should apply authentication', async () => {
        const axiosContextWithAuth: AxiosContext = {
            ...axiosContext,
            authentication: testAuthentication,
        };

        const mockResponse = {
            status: 200,
            data: { message: 'Success' },
            headers: { 'x-correlation-id': '12345' }
        };

        // Mock the modified URL with query parameters
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

        // Assert that the request was made with the modified URL and headers
        const requestHistory = mock.history.get[0];
        expect(requestHistory.url).toBe('https://example.com/api?test=test');
        expect(requestHistory.headers['x-test']).toBe('test');

        // Assert debug log calls
        expect(debugMock).toHaveBeenNthCalledWith(1, 'serviceCaller - req', serviceRequest);
        expect(debugMock).toHaveBeenNthCalledWith(2, 'serviceCaller - res', {
            status: mockResponse.status,
            body: mockResponse.data,
            headers: mockResponse.headers
        });
    });
});
