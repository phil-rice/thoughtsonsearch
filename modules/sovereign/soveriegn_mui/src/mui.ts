import {SimpleSovereignLayout, SovereignAppComponents} from "@enterprise_search/sovereign";
import {flagged} from "@enterprise_search/react_utils";
import {MuiSovereignHeader} from "./muiSovereignHeader";
import {SimpleSovereignHeader} from "@enterprise_search/sovereign/src/app/simpleSovereignHeader";
import {SimpleSovereignFooter} from "@enterprise_search/sovereign/src/app/simpleSovereignFooter";
import {SearchDropDownComponents, SimpleSearchBarAndImmediateSearchLayout, SimpleSearchDropdown} from "@enterprise_search/search_dropdown";
import {MuiSearchBarAndImmediateSearchLayout} from "./MuiSearchBarAndImmediateSearchLayout";
import {MuiSearchDropdown} from "./mui.search.drop.down";

export const muiFF='mui'

export const MuiSovereignComponents: SovereignAppComponents = {
    SovereignAppLayout:SimpleSovereignLayout,
    SovereignHeader: flagged(muiFF, MuiSovereignHeader,SimpleSovereignHeader),
    SovereignFooter: SimpleSovereignFooter
}


export const muiSearchDropDownComponents: SearchDropDownComponents = {
    SearchDropDown: flagged(muiFF, MuiSearchDropdown, SimpleSearchDropdown),
    SearchBarAndImmediateSearchLayout: flagged(muiFF, MuiSearchBarAndImmediateSearchLayout, SimpleSearchBarAndImmediateSearchLayout)
}