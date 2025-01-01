import {DataLayout, DataLayoutProps} from "../data.layout";
import React, {CSSProperties, ReactNode} from "react";

const styles: Record<string, CSSProperties> = {
    layoutContainer: {
        display: 'flex',  // Change to flex to allow stretching
        flexDirection: 'column',
        flexGrow: 1,      // Allow it to grow and fill parent space
        alignSelf: 'stretch',  // Stretch to parent width
        border: '1px solid #ddd',
        gap: '0.2rem',
    },
    layoutRow: {
        display: 'flex',
        width: '100%',    // Ensure rows fill container
        gap: '0.2rem',
    },
    layoutItem: {
        flex: 1,  // Allow items to fill row space
        padding: '0.5rem',
        borderRadius: '4px',
        whiteSpace: 'break-spaces'  // Keep line breaks within items
    }
};

export const SimpleDataLayout: DataLayout = ({ layout, children, className }: DataLayoutProps) => {
    const rows: ReactNode[][] = [];
    let childIndex = 0;

    const childrenArray = React.Children.toArray(children);

    // Create rows based on layout array
    for (const itemsInRow of layout) {
        const row = childrenArray.slice(childIndex, childIndex + itemsInRow);
        if (row.length > 0) {
            rows.push(row);
        }
        childIndex += itemsInRow;
    }

    return (
        <div
            className={className || 'layout-container'}
            role="presentation" // Suppresses unwanted semantics
            style={styles.layoutContainer}
        >
            {rows.map((row, rowIndex) => (
                <div key={rowIndex} role="row" style={styles.layoutRow}>
                    {row.map((child, colIndex) => (
                        <div key={colIndex} role="cell" style={styles.layoutItem}>
                            {child}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};
