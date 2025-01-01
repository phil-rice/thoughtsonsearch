import {DisplayDataWidget} from "./react.data";
import {SimpleTable} from "@enterprise_search/react_utils/src/table";
import React from "react";
import {useRenderers} from "@enterprise_search/renderers";


export const SimpleWidget = <T, >(titles: string[], keys: (keyof T)[], noWrap: (keyof T)[]): DisplayDataWidget<T> => ({data, title, id}) => {
    const {H2} = useRenderers()
    return <><H2 id={id} value={title}/><SimpleTable titles={titles} keys={keys} data={data.slice(0, 10).map(d => d.data)} noWrap={noWrap}/></>

}
