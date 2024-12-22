import React from "react";

export type DataSourceAllButtonProps = {}

export type DataSourceAllButton = (props: DataSourceAllButtonProps) => React.ReactElement


export function SimpleDataSourceAllButton(props: DataSourceAllButtonProps) {
    return <button>All</button>
}

export const simpleDataSourceButton = (dataSource: string) =>
    <button>{dataSource}</button>
