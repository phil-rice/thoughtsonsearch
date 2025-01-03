import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import SecurityIcon from '@mui/icons-material/Security';
import Build from '@mui/icons-material/Build';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';
import {DisplayLogin, DisplayLoginProps, useLogin, useUserData} from "@enterprise_search/react_login_component";
import React, {ReactElement} from "react";
import {useTranslation} from "@enterprise_search/translation";

function getUserRoleIcons(isAdmin: boolean, isDev: boolean): ReactElement[] {
    const icons = [];
    if (isAdmin) {
        icons.push(
            <Tooltip title="Admin" key="admin">
                <SecurityIcon color="primary" />
            </Tooltip>
        );
    }
    if (isDev) {
        icons.push(
            <Tooltip title="Developer" key="dev">
                <Build color="secondary" />
            </Tooltip>
        );
    }
    return icons;
}

export const MuiDisplayLogin: DisplayLogin = (props: DisplayLoginProps) => {
    const { login, logout } = useLogin();
    const userData = useUserData();
    const { loggedIn, email, isAdmin, isDev } = userData;
    const translate=useTranslation()

    return (
        <Box>
            {loggedIn ? (
                <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body1">
                        {translate('login.loggedIn')} {email}
                    </Typography>
                    <Stack direction="row" spacing={0.5}>
                        {getUserRoleIcons(isAdmin, isDev)}
                    </Stack>
                    <Button variant="outlined" color="secondary" onClick={logout}>
                        {translate('login.logout')}
                    </Button>
                </Stack>
            ) : (
                <Button variant="contained" color="primary" onClick={login}>
                    {translate('login.login')}
                </Button>
            )}
        </Box>
    );
};
