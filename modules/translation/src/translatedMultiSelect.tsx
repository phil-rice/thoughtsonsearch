import React from "react";
import {useIcon} from "@enterprise_search/icons";
import {useTranslation} from "./translation";
import {GetterSetter} from "@enterprise_search/react_utils";

interface CheckboxItemProps {
    name: string;
    rootId: string;
    isChecked: boolean;
    onChange: (name: string) => void;
}

const CheckboxItem: React.FC<CheckboxItemProps> = ({rootId, name, isChecked, onChange}) => {
    const translate = useTranslation();
    const {iconFn} = useIcon();
    const Icon = iconFn(name);
    const id = `${rootId}-${name}`;

    //needed for accessibility expectations. We are labeled as a listbox, so we need to handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        const currentElement = e.currentTarget;
        let nextElement: HTMLElement | null = null;

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                nextElement = currentElement.nextElementSibling as HTMLElement || currentElement.parentElement?.firstElementChild as HTMLElement;
                nextElement?.focus();
                break;
            case "ArrowUp":
                e.preventDefault();
                nextElement = currentElement.previousElementSibling as HTMLElement || currentElement.parentElement?.lastElementChild as HTMLElement;
                nextElement?.focus();
                break;
            case " ":
            case "Enter":
                e.preventDefault();
                onChange(name);
                break;
            default:
                break;
        }
    };


    return (
        <div
            className="dropdown-item"
            role="option"
            aria-selected={isChecked}
            tabIndex={0}
            onKeyDown={handleKeyDown}
        >
            <label htmlFor={id}>
                <input
                    id={id}
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onChange(name)}
                    aria-checked={isChecked}
                />
                <Icon/> {translate(name)}
            </label>
        </div>
    );
};


export interface TranslatedMultiSelectProps {
    id: string;
    purpose: string;
    allowedNames: string[];
    stateOps: GetterSetter<string[]>;
    className?: string;
    noItemsKey?: string;
}

export const TranslatedMultiSelect: React.FC<TranslatedMultiSelectProps> = ({
                                                                                id,
                                                                                purpose,
                                                                                allowedNames,
                                                                                stateOps,
                                                                                className = "custom-dropdown",
                                                                                noItemsKey
                                                                            }) => {
    const [selectedNames, setSelectedNames] = stateOps;
    const t = useTranslation();

    const handleCheckboxChange = (name: string) => {
        setSelectedNames(prev =>
            prev.includes(name)
                ? prev.filter(n => n !== name)
                : [...prev, name]
        );
    };

    return (
        <div id={id} className={className} aria-label={purpose} role="listbox" aria-multiselectable="true">
            {allowedNames.length === 0 && (
                <div className="empty-message" role="alert">
                    {noItemsKey ? t(noItemsKey) : t("common.noItemsAvailable")}
                </div>
            )}
            {allowedNames.map(name => (
                <CheckboxItem
                    key={name}
                    rootId={id}
                    name={name}
                    isChecked={selectedNames.includes(name)}
                    onChange={handleCheckboxChange}
                />
            ))}
        </div>
    );
};
