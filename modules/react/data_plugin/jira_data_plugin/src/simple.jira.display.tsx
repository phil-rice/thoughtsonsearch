import React from "react";
import {DisplayData, DisplayDataProps} from "@enterprise_search/react_data/src/react.data";
import {JiraData} from "./jira.data";
import {useAttributeValueComponents} from "@enterprise_search/renderers";
import {useRenderers} from "@enterprise_search/renderers";
import {ClipHeight} from "@enterprise_search/react_utils";

export const SimpleJiraDisplay: DisplayData<JiraData> =
    ({id, data}: DisplayDataProps<JiraData>) => {
        const {Text: JustText, Markdown, Url} = useRenderers()
        const {Text, Date, DataLayout} = useAttributeValueComponents()
        return <DataLayout className='jira-data' layout={[2, 1, 3, 1]}><span>{data.issue}</span>
            <JustText id={`${id}-summary`} value={data.summary}/>
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