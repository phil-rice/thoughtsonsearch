import React from "react";
import { DisplaySearchResultsLayout, DisplaySearchResultsLayoutProps } from "./display.search.results";

// Grid component with responsive inline CSS
export const SimpleDisplayResultsLayout: DisplaySearchResultsLayout = ({
                                                                           children,
                                                                       }: DisplaySearchResultsLayoutProps) => {
    const childArray = React.Children.toArray(children);
    const useSingleColumn = childArray.length === 1;

    return (
        <>
            <style>
                {`
                .search-results {
                    display: grid;
                    grid-template-columns: repeat(2, minmax(250px, 1fr));  /* Default to two columns */
                    gap: 1rem;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                @media (max-width: 800px) {
                    .search-results {
                        grid-template-columns: 1fr;   /* One column on smaller screens */
                        justify-content: center;
                        max-width: 600px;
                    }
                }
                `}
            </style>

            <div
                className="search-results"
                style={{
                    gridTemplateColumns: useSingleColumn ? '1fr' : undefined,
                    justifyContent: useSingleColumn ? 'center' : undefined,
                }}
            >
                {childArray.map((child, index) => (
                    <div key={index} style={{ boxSizing: 'border-box' }}>
                        {child}
                    </div>
                ))}
            </div>
        </>
    );
};
