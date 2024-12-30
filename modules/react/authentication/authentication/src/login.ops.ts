export type LoginOps = {
    //Doesn't pop open a new window, but logs in if it can
    refeshLogin: () => Promise<void>
    //what you should call when the user clicks 'login'
    login: () => Promise<void>
    logout: () => Promise<void>
}

