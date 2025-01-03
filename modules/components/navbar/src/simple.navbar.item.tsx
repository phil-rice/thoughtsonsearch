import {NavBarItem, NavBarItemProps} from "./navbar";
import React from "react";
import {useTranslation} from "@enterprise_search/translation";
import {useSelectableButton} from "@enterprise_search/selectable_button";


export const DefaultNavItem = (prefix: string): NavBarItem =>
    ({value, selectedOps}: NavBarItemProps) => {
        const [selected, setSelected] = selectedOps
        const translate = useTranslation()
        const SelectableButton = useSelectableButton()
        const translateKey = `${prefix}.${value}`;
        return <SelectableButton selected={selected === value} onClick={() => setSelected(value)} text={translate(translateKey)}/>
    };


