export type UserData = {
    email: string
    isDev: boolean
    isAdmin: boolean
}

export type UserDataGetter = () => UserData