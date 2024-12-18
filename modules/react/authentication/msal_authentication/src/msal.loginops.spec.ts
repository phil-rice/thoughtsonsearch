import {MsalLogin, MsalLoginFn} from "./msal.login";
import {AccountInfo, AuthenticationResult, PublicClientApplication} from "@azure/msal-browser";
import {MsalLogout} from "./msal.logout";
import {loginUsingMsal} from "./msal.loginops";

describe("loginUsingMsal", () => {
    let mockMsalInstance: jest.Mocked<PublicClientApplication>;

    beforeEach(() => {
        mockMsalInstance = {
            getAllAccounts: jest.fn(),
        } as unknown as jest.Mocked<PublicClientApplication>;
    });
    it("should call the login function with the provided scopes", async () => {
        const mockLogin: MsalLoginFn = jest.fn().mockImplementation(
            (msal) => (scopes:string[]) => {
                expect(scopes).toEqual(["user.read", "email"]);
                expect(msal).toBe(mockMsalInstance);
                return Promise.resolve({test: "login success"} as unknown as AuthenticationResult);
            }
        );

        const mockLogout: MsalLogout = {name: "mockLogout", logout: jest.fn()};
        const scopes = ["user.read", "email"];

        const loginHandler = loginUsingMsal({
            msal: mockMsalInstance,
            scopes,
            login: mockLogin,
            logout: mockLogout,
        });

        const result = await loginHandler.login();

        expect(result).toEqual({test: "login success"});
    });

    it("should call the logout function for the first account", async () => {
        const mockAccount: AccountInfo = {username: "testUser", homeAccountId: "id123", environment: "env", tenantId: "tenant123"} as AccountInfo;
        const mockLogout: MsalLogout = {name: "mockLogout", logout: jest.fn()};
        mockMsalInstance.getAllAccounts.mockReturnValue([mockAccount]);

        const loginHandler = loginUsingMsal({
            login: undefined as any,
            msal: mockMsalInstance,
            logout: mockLogout,
        });

        await loginHandler.logout();

        expect(mockLogout.logout).toHaveBeenCalledWith(mockMsalInstance, mockAccount);
    });

    it("should do nothing if there are no accounts to logout", async () => {
        const mockLogout: MsalLogout = {name: "mockLogout", logout: jest.fn()};
        mockMsalInstance.getAllAccounts.mockReturnValue([]);

        const loginHandler = loginUsingMsal({
            login: undefined as any,
            msal: mockMsalInstance,
            logout: mockLogout,
        });

        await loginHandler.logout();

        expect(mockLogout.logout).not.toHaveBeenCalled();
    });

    it("should correctly determine if a user is logged in", () => {
        mockMsalInstance.getAllAccounts.mockReturnValue([{username: "testUser", homeAccountId: "id123", environment: "env", tenantId: "tenant123"} as AccountInfo]);

        const loginHandler = loginUsingMsal({
            login: undefined as any,
            logout: undefined as any,
            msal: mockMsalInstance,
        });

        expect(loginHandler.isLoggedIn()).toBe(true);

        mockMsalInstance.getAllAccounts.mockReturnValue([]);
        expect(loginHandler.isLoggedIn()).toBe(false);
    });

});
