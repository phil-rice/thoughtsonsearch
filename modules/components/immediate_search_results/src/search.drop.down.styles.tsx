import React, {CSSProperties} from 'react';

// Define a type for dropdown styles
export type SearchDropdownStyles = Record<
    'dropdown' | 'suggestion' | 'errors' | 'error',
    CSSProperties
>;


export const defaultSearchDropDownStyles: SearchDropdownStyles = {
    dropdown: {
        position: 'absolute',
        top: '40px',
        width: '100%',
        border: '1px solid #ccc',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        backgroundColor: 'white',
        zIndex: 1000,
        borderRadius: '4px',
    },
    suggestion: {
        padding: '10px',
        cursor: 'pointer',
    },
    errors: {
        marginTop: '10px',
        padding: '10px',
        backgroundColor: '#ffe6e6',
        border: '1px solid #ffb3b3',
        borderRadius: '4px',
    },
    error: {
        padding: '5px 0',
        color: '#d8000c',
        fontWeight: 'bold',
    },
};
