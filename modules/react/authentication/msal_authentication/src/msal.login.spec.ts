import {chainLogin, fromPreviousRedirectLogin, MsalLogin, popupLogin, redirectLogin, silentLogin} from "./msal.login";
import {AuthenticationResult, PublicClientApplication} from "@azure/msal-browser";


describe('chainLogin', () => {
    // A "blind" msalInstance mock – no functionality, purely passed for compatibility
    const blindMsalInstance = {} as any;

    it('should return the first successful result', async () => {
        const login1: MsalLogin = {
            name: 'login1',
            login: () => async () => null, // No result
        };
        const login2: MsalLogin = {
            name: 'login2',
            login: () => async () => ({account: 'testAccount2'} as any), // Success
        };
        const login3: MsalLogin = {
            name: 'login3',
            login: () => async () => ({account: 'testAccount3'} as any), // Should not be called
        };

        const chained = chainLogin(blindMsalInstance, login1, login2, login3);
        const result = await chained([]);

        expect(result).toEqual({account: 'testAccount2'});
    });

    it('should call all methods if they fail and return null', async () => {
        const login1: MsalLogin = {
            name: 'login1',
            login: () => async () => {
                throw new Error('login1 failed');
            },
        };
        const login2: MsalLogin = {
            name: 'login2',
            login: () => async () => {
                throw new Error('login2 failed');
            },
        };
        const login3: MsalLogin = {
            name: 'login3',
            login: () => async () => {
                throw new Error('login3 failed');
            },
        };

        const chained = chainLogin(blindMsalInstance, login1, login2, login3);
        const result = await chained([]);

        expect(result).toBeNull();
    });

    it('should handle mixed failures and successes', async () => {
        const login1: MsalLogin = {
            name: 'login1',
            login: () => async () => {
                throw new Error('login1 failed');
            },
        };
        const login2: MsalLogin = {
            name: 'login2',
            login: () => async () => ({account: 'testAccount2'} as any), // Success
        };
        const login3: MsalLogin = {
            name: 'login3',
            login: () => async () => {
                throw new Error('login3 failed');
            },
        };

        const chained = chainLogin(blindMsalInstance, login1, login2, login3);
        const result = await chained([]);

        expect(result).toEqual({account: 'testAccount2'});
    });

    it('should return null if all methods return null', async () => {
        const login1: MsalLogin = {
            name: 'login1',
            login: () => async () => null,
        };
        const login2: MsalLogin = {
            name: 'login2',
            login: () => async () => null,
        };
        const login3: MsalLogin = {
            name: 'login3',
            login: () => async () => null,
        };

        const chained = chainLogin(blindMsalInstance, login1, login2, login3);
        const result = await chained([]);

        expect(result).toBeNull();
    });

    it('should prioritize the order of acquisitions', async () => {
        const login1: MsalLogin = {
            name: 'login1',
            login: () => async () => ({account: 'testAccount1'} as any), // Success
        };
        const login2: MsalLogin = {
            name: 'login2',
            login: () => async () => ({account: 'testAccount2'} as any), // Should not be called
        };
        const login3: MsalLogin = {
            name: 'login3',
            login: () => async () => ({account: 'testAccount3'} as any), // Should not be called
        };

        const chained = chainLogin(blindMsalInstance, login1, login2, login3);
        const result = await chained([]);

        expect(result).toEqual({account: 'testAccount1'});
    });
});


describe('MsalLogin methods', () => {
    let mockMsalInstance: jest.Mocked<PublicClientApplication>;

    beforeEach(() => {
        mockMsalInstance = {
            handleRedirectPromise: jest.fn(),
            acquireTokenSilent: jest.fn(),
            acquireTokenPopup: jest.fn(),
            acquireTokenRedirect: jest.fn(),
        } as unknown as jest.Mocked<PublicClientApplication>;
    });

    const testAcquireMethod = async (
        acquire: MsalLogin,
        msalMethod: keyof typeof mockMsalInstance,
        scopes: string[] = [],
        prompt?: string,
        overrideReturnValue?: any
    ) => {
        const mockReturnValue = overrideReturnValue === undefined
            ? ({test: 'result'} as unknown as AuthenticationResult)
            : overrideReturnValue;
        (mockMsalInstance[msalMethod] as jest.Mock).mockResolvedValue(mockReturnValue);

        const result = await acquire.login(scopes)(mockMsalInstance);

        expect(mockMsalInstance[msalMethod]).toHaveBeenCalledTimes(1);
        if (msalMethod === 'handleRedirectPromise') {
            // Special case: handleRedirectPromise does not use scopes
            expect(mockMsalInstance[msalMethod]).toHaveBeenCalledWith();
        } else {
            if (prompt) {
                expect(mockMsalInstance[msalMethod]).toHaveBeenCalledWith({scopes, prompt});
            } else
                expect(mockMsalInstance[msalMethod]).toHaveBeenCalledWith({scopes});
        }

        expect(result).toEqual(mockReturnValue);
    };

    const testAcquireErrorPropagation = async (
        acquire: MsalLogin,
        msalMethod: keyof typeof mockMsalInstance,
        scopes: string[] = []
    ) => {
        const mockError = new Error('Test error');
        (mockMsalInstance[msalMethod] as jest.Mock).mockRejectedValue(mockError);

        await expect(acquire.login(scopes)(mockMsalInstance)).rejects.toThrow(mockError);
    };

    it('should call handleRedirectPromise for fromPreviousRedirectLogin', async () => {
        await testAcquireMethod(fromPreviousRedirectLogin, 'handleRedirectPromise');
    });

    it('should propagate errors from handleRedirectPromise in fromPreviousRedirectLogin', async () => {
        await testAcquireErrorPropagation(fromPreviousRedirectLogin, 'handleRedirectPromise');
    });

    it('should call acquireTokenSilent for silentLogin', async () => {
        const scopes = ['user.read'];
        await testAcquireMethod(silentLogin, 'acquireTokenSilent', scopes);
    });

    it('should propagate errors from acquireTokenSilent in silentLogin', async () => {
        const scopes = ['user.read'];
        await testAcquireErrorPropagation(silentLogin, 'acquireTokenSilent', scopes);
    });

    it('should call acquireTokenPopup for popupLogin', async () => {
        const scopes = ['user.read'];
        await testAcquireMethod(popupLogin, 'acquireTokenPopup', scopes, 'select_account');
    });

    it('should propagate errors from acquireTokenPopup in popupLogin', async () => {
        const scopes = ['user.read'];
        await testAcquireErrorPropagation(popupLogin, 'acquireTokenPopup', scopes);
    });

    it('should call acquireTokenRedirect for redirectLogin', async () => {
        const scopes = ['user.read'];
        await testAcquireMethod(redirectLogin, 'acquireTokenRedirect', scopes, 'select_account', null);
    });

    it('should propagate errors from acquireTokenRedirect in redirectLogin', async () => {
        const scopes = ['user.read'];
        await testAcquireErrorPropagation(redirectLogin, 'acquireTokenRedirect', scopes);
    });
});

