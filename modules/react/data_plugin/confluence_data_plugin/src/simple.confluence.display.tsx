import {DisplayData, DisplayDataProps, DisplayDataWidget} from "@enterprise_search/react_data/src/react.data";
import {ConfluenceData} from "./confluence.data";
import React from "react";
import {useAttributeValueComponents, useRenderers} from "@enterprise_search/renderers";
import {ClipHeight} from "@enterprise_search/react_utils";
import {SimpleWidget} from "@enterprise_search/react_data/src/simple.widget";

export const SimpleConfluenceDisplay: DisplayData<ConfluenceData> =
    ({id, data}: DisplayDataProps<ConfluenceData>) => {
        const { Html, Url} = useRenderers()
        const {Text, Date, DataLayout} = useAttributeValueComponents()

        return <DataLayout className='jira-data' layout={[1, 1, 3, 1]}>
            <span>{data.title}</span>
            <ClipHeight maxHeight='5rem' force={true}>
                <Html id={`${id}-description`} value={data.body}/>
            </ClipHeight>
            <Text rootId={id} attribute='source' value={`confluence`}/>
            <Text rootId={id} attribute='space' value={data.space}/>
            <Date rootId={id} attribute='last updated' value={data.last_updated}/>
            <Url id={`${id}-url`} value={data.url}/>
        </DataLayout>
    };


export const SimpleConfluenceOneLineDisplay: DisplayData<ConfluenceData> =
    ({data}: DisplayDataProps<ConfluenceData>) => {
        return <span>{data.type} {data.title}</span>
    }

export const SimpleConfluenceWidget: DisplayDataWidget<ConfluenceData> =
    SimpleWidget<ConfluenceData>(['space', 'title', 'body'], ['space', 'title', 'body'], ['space'])
