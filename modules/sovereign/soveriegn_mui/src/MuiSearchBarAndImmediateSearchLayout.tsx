// MuiSearchBarAndImmediateSearchLayout.tsx
import React, {ReactNode} from "react";

import Box from "@mui/material/Box";
import {SearchBarAndImmediateSearchLayout, SearchBarAndImmediateSearchLayoutProps} from "@enterprise_search/search_dropdown";

export const MuiSearchBarAndImmediateSearchLayout: SearchBarAndImmediateSearchLayout = ({ children }: SearchBarAndImmediateSearchLayoutProps): ReactNode => (
    <Box
        sx={{
            position: 'relative',
            width: '100%',
            maxWidth: '1200px',  // Adjust based on your design
            margin: '0 auto',
            // Add any additional MUI-specific styles if needed
        }}
    >
        {children}
    </Box>
);
