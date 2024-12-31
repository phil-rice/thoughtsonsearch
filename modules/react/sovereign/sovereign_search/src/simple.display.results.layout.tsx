import React from "react";
import { DisplaySearchResultsLayout, DisplaySearchResultsLayoutProps } from "./display.search.results";

// Grid component with inline CSS for responsiveness
export const SimpleDisplayResultsLayout: DisplaySearchResultsLayout = ({
                                                                           children,
                                                                       }: DisplaySearchResultsLayoutProps) => {
    const childArray = React.Children.toArray(children);

    return (
        <>
            <style>
                {`
                .search-results {
                    display: grid;
                    grid-template-columns: repeat(2, minmax(250px, 1fr));  /* Two equal columns */
                    gap: 1rem;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                @media (max-width: 800px) {
                    .search-results {
                        grid-template-columns: 1fr;  /* Collapse to one column */
                    }
                }
                `}
            </style>

            <div className="search-results">
                {childArray.map((child, index) => (
                    <div key={index} style={{ boxSizing: 'border-box' }}>
                        {child}
                    </div>
                ))}
            </div>
        </>
    );
};
