export type UserData = {
    loggedIn: boolean
    email: string
    isDev: boolean
    isAdmin: boolean
}

export type UserDataGetter = () => UserData