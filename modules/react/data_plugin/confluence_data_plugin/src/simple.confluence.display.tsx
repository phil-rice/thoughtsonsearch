import {DisplayData, DisplayDataArray, DisplayDataProps, DisplayDataWidget} from "@enterprise_search/react_data/src/react.data";
import {ConfluenceData} from "./confluence.data";
import React from "react";
import {JiraData} from "@enterprise_search/jira_data_plugin";
import {useAttributeValueComponents, useRenderers} from "@enterprise_search/renderers";
import {ClipHeight} from "@enterprise_search/react_utils";
import {SimpleTable} from "@enterprise_search/react_utils/src/table";
import {SimpleWidget} from "@enterprise_search/react_data/src/simple.widget";
//{
//   "last_updated": "p34350@eon.com",
//   "mediaType": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
//   "type": "confluence",
//   "body": "Hybrid Search\n\n\n\n\n\nContext\nWe want to deliver effective enterprise search across multiple data sources\nWe want to be able to deliver an AI Assistant that helps make sense of the data sources, and answ",
//   "title": "Hybrid Search.pptx",
//   "space": "m8nmvp1",
//   "url": "https://confluence.eon.com/display/m8nmvp1/Hybrid+Search?preview=%2F622603372%2F622603373%2FHybrid+Search.pptx",
//   "download": "https://confluence.eon.com/download/attachments/622603372/Hybrid%20Search.pptx?version=1&modificationDate=1728644363513&api=v2",
//   "attachment": true,
//   "size": 368214,
//   "id": "622603373",
//   "status": "current",
//   "last_update_date": "2024-10-11T10:59:23.513Z",
//   "_index": "confluence-prod",
//   "_id": "att_622603373",
//   "_score": 14.669627,
//   "_ignored": [
//     "full_text.keyword"
//   ],
//   "sort": [
//     14.669627,
//     "att_622603373"
//   ]
export const SimpleConfluenceDisplay: DisplayData<ConfluenceData> =
    ({id, data}: DisplayDataProps<ConfluenceData>) => {
        const {Text: JustText, Markdown, Html, Url} = useRenderers()
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
