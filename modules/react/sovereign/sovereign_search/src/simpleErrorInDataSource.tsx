import React from "react";
import {ErrorInDataSource, ErrorInDataSourceProps} from "./search.results.components";

export const SimpleErrorInDataSourceDev: ErrorInDataSource = ({dataSourceName, errors}: ErrorInDataSourceProps) => {
    return <div>
        <h1>Error in {dataSourceName}</h1>
        <p>Reference number {errors.reference}</p>
        <ul>
            {errors.errors.map((error, i) => <li key={i}>{error}</li>)}
        </ul>
    </div>;
};

export const SimpleErrorInDataSourceNormal: ErrorInDataSource = ({dataSourceName, errors}: ErrorInDataSourceProps) => {
    return <div>
        <h1>Unexpected error in {dataSourceName}</h1>
        <p>This has been reported to the devs</p>
        <p>Reference number {errors.reference}</p>
    </div>;
}
