// MuiHeaderLayout.tsx
import React, { ReactNode } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { styled } from '@mui/material/styles';

export type MuiHeaderLayoutProps = {
    children: [ReactNode, ReactNode];
};

// Styled AppBar with MUI's theming
const StyledAppBar = styled(AppBar)(({ theme }) => ({
    borderBottom: `1px solid ${theme.palette.divider}`,
}));

// Layout Component using MUI
export function MuiHeaderLayout({ children }: MuiHeaderLayoutProps): JSX.Element {
    return (
        <StyledAppBar position="static" color="default" elevation={0}>
            <Toolbar
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.5rem 1rem',
                }}
            >
                {children}
            </Toolbar>
        </StyledAppBar>
    );
}
