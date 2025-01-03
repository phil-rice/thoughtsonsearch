// MuiNavItem.tsx
import React from "react";
import {makeNavBar, NavBar, NavBarItem, NavBarItemProps} from "@enterprise_search/navbar";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import {DataViewNavBarLayout} from "@enterprise_search/data_views"; // Adjust the import path as necessary
import Button from "@mui/material/Button";
import {useTranslation} from "@enterprise_search/translation";

export function makeMuiNavBar(
    purpose: string,
    items: string[]
): NavBar {
    return makeNavBar(items, MuiNavItem(purpose), MuiNavbarLayout(purpose));
}

export const MuiNavbarLayout = (purpose: string): DataViewNavBarLayout => ({children}) => (
    <AppBar position="static" component="nav" aria-label={purpose}>
        <Toolbar>
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                gap={2} // MUI spacing (2 * 8px = 16px)
                flexWrap="wrap"
                width="100%"
            >
                {children}
            </Box>
        </Toolbar>
    </AppBar>
);

export const MuiNavItem = (prefix: string): NavBarItem =>
    ({value, selectedOps}: NavBarItemProps) => {
        const [selected, setSelected] = selectedOps;
        const t = useTranslation(); // Destructure translation function
        const translateKey = `${prefix}.${value}`;

        return (
            <Button
                variant={selected === value ? "contained" : "text"}
                color={selected === value ? "primary" : "inherit"}
                onClick={() => setSelected(value)}
                sx={{
                    textTransform: 'none', // Prevent uppercase transformation
                }}
            >
                {t(translateKey)}
            </Button>
        );
    };

