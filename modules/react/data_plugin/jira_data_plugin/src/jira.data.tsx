import {DataPlugin, DisplayData, DisplayDataWidget} from "@enterprise_search/react_data/src/react.data";
import {SimpleJiraDisplay, SimpleJiraWidget, SimpleOneLineJiraDisplay} from "./simple.jira.display";
import {simpleDisplayDataArray} from "@enterprise_search/react_data";

export const JiraDataName = 'jira'

export type JiraData = {
    url: string;
    type: string
    status: string
    summary: string
    issue: string
    description: string
    last_updated: string
}

export function JiraDataPlugin(
    DisplayData: DisplayData<JiraData> = SimpleJiraDisplay,
    OneLineDisplayData: DisplayData<JiraData> = SimpleOneLineJiraDisplay,
    DisplayDataWidget: DisplayDataWidget<JiraData> = SimpleJiraWidget): DataPlugin<JiraData> {
    return {
        plugin: 'data',
        type: JiraDataName,
        DisplayDataArray: simpleDisplayDataArray,
        DisplayData,
        OneLineDisplayData,
        DisplayDataWidget
    }
}
