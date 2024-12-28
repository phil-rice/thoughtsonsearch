import React, {createContext, useEffect, useState} from "react";
import {useThrowError} from "@enterprise_search/react_utils";

export type WindowUrlData = {
    url: URL
    parts: string[]
}

export const WindowUrlContext = createContext<WindowUrlData | undefined>(undefined)

export type WindowUrlProviderProps = {
    children: React.ReactNode
}

// Helper function to get current URL and path parts
function makeWindowUrlData(): WindowUrlData {
    const url = new URL(window.location.href)
    const parts = url.pathname.split('/').filter(Boolean)
    return {url, parts}
}

// Custom event trigger for pushState and replaceState
function triggerUrlChange() {
    const event = new Event('url-change')
    window.dispatchEvent(event)
}

// Override pushState and replaceState to trigger custom event
function overrideHistoryMethod(method: 'pushState' | 'replaceState') {
    const original = history[method]
    return function (this: History, ...args: any[]) {
        const result = original.apply(this, args)
        triggerUrlChange()  // Fire custom event
        return result
    }
}

export const WindowUrlProvider = ({children}: WindowUrlProviderProps) => {
    const [windowUrlData, setWindowUrlData] = useState<WindowUrlData>(makeWindowUrlData)

    useEffect(() => {
        // Update state when the URL changes
        const updateWindowUrl = () => {
            setWindowUrlData(makeWindowUrlData())
        }

        // Listen to popstate (back/forward) and custom url-change event
        window.addEventListener('popstate', updateWindowUrl)
        window.addEventListener('url-change', updateWindowUrl)

        // Override pushState and replaceState (run once)
        history.pushState = overrideHistoryMethod('pushState')
        history.replaceState = overrideHistoryMethod('replaceState')

        // Cleanup listeners on unmount
        return () => {
            window.removeEventListener('popstate', updateWindowUrl)
            window.removeEventListener('url-change', updateWindowUrl)
        }
    }, [])

    return (
        <WindowUrlContext.Provider value={windowUrlData}>
            {children}
        </WindowUrlContext.Provider>
    )
}

export function useWindowUrlData(): WindowUrlData {
    const result = React.useContext(WindowUrlContext);
    const throwError = useThrowError()
    if (result === undefined) throwError('s/w', 'useWindowUrlData must be used within a WindowUrlProvider')
    return result
}

export function useWindowsUrl(): URL {
    return useWindowUrlData().url
}

export function useWindowsPath() {
    return useWindowUrlData().parts
}