import React, { CSSProperties, useState, useEffect } from "react";
import { DisplaySearchResultsLayout, DisplaySearchResultsLayoutProps } from "./display.search.results";
const styles: Record<string, CSSProperties> = {
    container: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',  // Two equal columns by default
        width: '100%',
        gap: '1rem',
        overflow: 'hidden',
        wordBreak: 'break-word',
        overflowWrap: 'anywhere',
    },
    singleColumn: {
        gridTemplateColumns: 'auto',  // Auto size to fit content (fix for single column)
        width: 'fit-content',         // Grid shrinks to fit the content width
        margin: '0 auto',             // Center the grid horizontally
    },
    gridItem: {
        width: '100%',
        boxSizing: 'border-box',
        minWidth: 0,
    },
    gridItemContent: {
        width: '100%',
    }
};


export const SimpleDisplayResultsLayout: DisplaySearchResultsLayout = ({ children }: DisplaySearchResultsLayoutProps) => {
    const childArray = React.Children.toArray(children);
    const [isSingleColumn, setIsSingleColumn] = useState(childArray.length === 1 || window.innerWidth < 400);

    useEffect(() => {
        const handleResize = () => {
            setIsSingleColumn(childArray.length === 1 || window.innerWidth < 800);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [...childArray]);

    return (
        <div
            className="search-results"
            style={{
                ...styles.container,
                ...(isSingleColumn ? styles.singleColumn : {}),
            }}
        >
            {childArray.map((child, index) => (
                <div key={index} style={styles.gridItem}>
                    <div style={styles.gridItemContent}>
                        {child}
                    </div>
                </div>
            ))}
        </div>
    );
};
