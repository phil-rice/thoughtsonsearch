export type ErrorType = 's/w' | 'validation' | 'network' | 'ui'
export type ReportError = (type: ErrorType, msg: string, e?: any) => void;
