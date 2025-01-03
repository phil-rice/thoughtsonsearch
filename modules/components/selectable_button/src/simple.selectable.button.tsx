import React from "react";
import {SelectableButton} from "./selectable.button";


export const SimpleSelectableButton: SelectableButton =
    ({selected, text, onClick}) => (
        <button
            style={{
                padding: '1rem',
                borderRadius: '0.5rem',
                border: selected ? '2px solid #007bff' : '1px solid #000', // Highlight border if selected
                backgroundColor: selected ? '#007bff' : '#fff', // Blue background if selected
                color: selected ? '#fff' : '#000', // White text if selected
                cursor: 'pointer',
                transition: 'background-color 0.3s, border-color 0.3s', // Smooth transitions for hover and selection
            }}
            onClick={onClick}
        >{text}</button>
    );


