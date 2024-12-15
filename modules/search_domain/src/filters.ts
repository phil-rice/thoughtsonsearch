export type SinceFilter = {
    unit: 'years' | 'months' | 'days' | 'hours'
    time: number
}

export type LanguageFilter = string[]

export type FileType = 'ppt' | 'doc' | 'sheet' | 'picture' | 'other'
export const fileTypes: FileType[] = ['ppt', 'doc', 'sheet', 'picture', 'other']
export type FileTypeFilter = FileType[]

