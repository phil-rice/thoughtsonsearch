import React from "react";
import {SearchBarAndImmediateSearchLayout, SearchBarAndImmediateSearchLayoutProps} from "./search.drop.down";

const styles: Record<string, React.CSSProperties> = {
    searchContainer: {
        position: 'relative',
        width: '100%',
        maxWidth: '600px',  // Adjust based on your design
        margin: '0 auto',
    },
};


export const SimpleSearchBarAndImmediateSearchLayout: SearchBarAndImmediateSearchLayout = ({children}: SearchBarAndImmediateSearchLayoutProps) => <div style={styles.searchContainer}>
    {children}
</div>;