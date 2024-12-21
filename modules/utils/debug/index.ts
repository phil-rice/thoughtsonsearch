export type  DebugContext = {
    legalDebugs?: string[] // for documentation
    debug?: string[] // the actual debugs
}

export function debug(context: DebugContext, debug: string, ...msgs: string[]) {
    if (context.debug?.includes(debug)) console.log(debug, ...msgs)
}
