import {SovereignHeader} from "@enterprise_search/sovereign";
import {useLoginComponents} from "@enterprise_search/react_login_component";
import {useTranslation} from "@enterprise_search/translation";
import {MuiHeaderLayout} from "./mui.layout";
import Link from "@mui/material/Link";
import IconButton from "@mui/material/IconButton";
import HomeIcon from "@mui/icons-material/Home";
import React from "react";

export const MuiSovereignHeader: SovereignHeader = () => {
    const {DisplayLogin} = useLoginComponents();
    const translate = useTranslation();

    return (
        <MuiHeaderLayout>
            <Link href="/" underline="none" title={translate('header.home')}>
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label={translate('header.home')}
                >
                    <HomeIcon/>
                </IconButton>
            </Link>
            <DisplayLogin/>
        </MuiHeaderLayout>
    );
};