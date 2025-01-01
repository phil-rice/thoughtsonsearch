import React from "react";
import {DisplayData, DisplayDataProps, DisplayDataWidget} from "@enterprise_search/react_data/src/react.data";
import {JiraData} from "./jira.data";
import {useAttributeValueComponents, useRenderers} from "@enterprise_search/renderers";
import {ClipHeight} from "@enterprise_search/react_utils";
import {SimpleWidget} from "@enterprise_search/react_data/src/simple.widget";

export const SimpleJiraDisplay: DisplayData<JiraData> =
    ({id, data}: DisplayDataProps<JiraData>) => {
        const {Text: JustText, Markdown, Url} = useRenderers()
        const {Text, Date, DataLayout} = useAttributeValueComponents()
        return <DataLayout className='jira-data' layout={[1, 1, 3, 1]}>
            <JustText id={`${id}-summary`} value={`${data.issue}: ${data.summary}`}/>
            <ClipHeight maxHeight='5rem' force={true}>
                <Markdown id={`${id}-description`} value={data.description}/>
            </ClipHeight>
            <Text rootId={id} attribute='source' value='jira'/>
            <Text rootId={id} attribute='status' value={data.status}/>
            <Date rootId={id} attribute='last updated' value={data.last_updated}/>
            <Url id={`${id}-url`} value={data.url}/>
        </DataLayout>
    };

export const SimpleOneLineJiraDisplay: DisplayData<JiraData> =
    ({data}: DisplayDataProps<JiraData>) =>
        <span>{data.type} {data.summary}</span>

export const SimpleJiraWidget: DisplayDataWidget<JiraData> =
    SimpleWidget(
        ['issue', 'summary', 'status'],
        ['issue', 'summary', 'status'],
        ['issue', 'status']);

