import {DataPlugin, DisplayData} from "@enterprise_search/react_data/src/react.data";
import {SimpleJiraDisplay, SimpleOneLineJiraDisplay} from "./simple.jira.display";

export const JiraDataName = 'jira'

export type JiraData = {
    type: string
    summary: string
    issue: string
    description: string
    last_updated: string
}

export function JiraDataPlugin(
    DisplayData: DisplayData<JiraData> = SimpleJiraDisplay,
    OneLineDisplayData: DisplayData<JiraData> = SimpleOneLineJiraDisplay): DataPlugin<JiraData> {
    return {
        plugin: 'data',
        type: JiraDataName,
        DisplayData,
        OneLineDisplayData
    }
}
