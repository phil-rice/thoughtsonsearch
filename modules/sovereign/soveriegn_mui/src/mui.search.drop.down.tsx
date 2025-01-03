import {DisplaySearchDropDownErrors, DisplaySearchDropDownErrorsProps, DisplaySearchDropDownResults, DisplaySearchDropDownResultsProps, SearchDropDown, SearchDropDownProps, useDropdownData} from "@enterprise_search/search_dropdown";
import {useOneLineDisplayDataComponent} from "@enterprise_search/react_data";
import {List, ListItem, ListItemText, ListItemButton, Alert, AlertTitle, Divider} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {defaultSearchDropDownStyles} from "@enterprise_search/search_dropdown/src/search.drop.down.styles";
import {useUserData} from "@enterprise_search/react_login_component";
import React, {ReactNode, useMemo} from "react";
export const MuiDisplaySearchDropDownResults: DisplaySearchDropDownResults = <Data, >({
                                                                                          dataAndDs,
                                                                                          onSelect,
                                                                                          st,
                                                                                          styles
                                                                                      }: DisplaySearchDropDownResultsProps) => {
    const displayOneLine = useOneLineDisplayDataComponent();

    return (
        <List>
            {dataAndDs.map(({ data, dataSourceName }, index) => (
                <React.Fragment key={index}>
                    <ListItem disablePadding>
                        <ListItemButton
                            onClick={() => onSelect(data, dataSourceName)}
                            sx={{
                                padding: '10px 16px',
                                cursor: 'pointer',
                                ...styles.suggestion,
                                '&:hover': {
                                    backgroundColor: '#f5f5f5',
                                },
                            }}
                        >
                            {/* Optionally, add an icon or avatar here */}
                            <ListItemText
                                primary={
                                    <Typography variant="body2">
                                        {displayOneLine((data as any).type)({ data, id: `${st}-dropdown-${index}` })}
                                    </Typography>
                                }
                                secondary={dataSourceName} // Display data source name as secondary text
                            />
                        </ListItemButton>
                    </ListItem>
                    {/* Add Divider except after the last item */}
                    {index < dataAndDs.length - 1 && <Divider component="li" />}
                </React.Fragment>
            ))}
        </List>
    );
};

export const MuiDisplaySearchDropDownErrors: DisplaySearchDropDownErrors =
    ({ srToError, styles }: DisplaySearchDropDownErrorsProps) => {
        if (Object.keys(srToError).length === 0) return null;

        return (
            <Alert severity="error" sx={{ ...styles.errors }}>
                <AlertTitle>Error</AlertTitle>
                <List>
                    {Object.entries(srToError).map(([source, error]) => (
                        <ListItem key={source} sx={{ ...styles.error, padding: 0 }}>
                            <Typography variant="body2">
                                <strong>{source}:</strong> {JSON.stringify(error)}
                            </Typography>
                        </ListItem>
                    ))}
                </List>
            </Alert>
        );
    };

// Main Dropdown Component
export const MuiSearchDropdown: SearchDropDown = ({
                                                      st,
                                                      onSelect,
                                                      styles = defaultSearchDropDownStyles,
                                                      DisplaySearchDropDownResults = MuiDisplaySearchDropDownResults,
                                                      DisplaySearchDropDownErrors = MuiDisplaySearchDropDownErrors
                                                  }: SearchDropDownProps): ReactNode => {
    const { dataAndDs, srToError } = useDropdownData(st);
    const userData = useUserData();
    const mergedStyles = useMemo(() => ({ ...defaultSearchDropDownStyles, ...styles }), [styles]);

    if (Object.keys(srToError).length > 0 || dataAndDs.length > 0) {
        return (
            <Box
                sx={{
                    position: 'absolute',
                    top: '60px',
                    width: '100%',
                    border: '1px solid #ccc',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    backgroundColor: 'white',
                    zIndex: 1000,
                    borderRadius: '4px',
                    // ...mergedStyles.dropdown,
                }}
                aria-hidden="true"  // Completely hides the dropdown from screen readers
            >
                <DisplaySearchDropDownResults dataAndDs={dataAndDs} onSelect={onSelect} st={st} styles={mergedStyles} />
                {dataAndDs.length === 0 && (
                    <Typography
                        variant="body2"
                        sx={{
                            padding: '10px',
                            cursor: 'pointer',
                            ...mergedStyles.suggestion,
                        }}
                    >
                        No results found
                    </Typography>
                )}
                {userData.isDev && <DisplaySearchDropDownErrors srToError={srToError} styles={mergedStyles} />}
            </Box>
        );
    }
    return null;
};
