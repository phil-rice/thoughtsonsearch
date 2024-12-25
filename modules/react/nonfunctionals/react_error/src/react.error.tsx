import {ErrorType, ReportError} from "@enterprise_search/errors";
import React from "react";


export const ThrowError: ReportError = (type: ErrorType, msg) => {
    throw new Error(`${type}: ${msg}`)
}

//Note that we can't use makeContextFor here because we are used in that method
export const ReportErrorContext = React.createContext<ReportError>(ThrowError)
export const useReportError = () => React.useContext(ReportErrorContext)

export type ReportErrorProviderProps = {
    reportError: ReportError
    children: React.ReactNode
}
export function ReportErrorProvider({reportError, children}: ReportErrorProviderProps) {
    return <ReportErrorContext.Provider value={reportError}>{children}</ReportErrorContext.Provider>
}
