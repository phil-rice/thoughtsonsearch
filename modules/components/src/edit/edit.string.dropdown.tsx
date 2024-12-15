import {useRecoilState} from "recoil";
import {StringValueProps} from "./edit.string";
import {keySelector} from "./selector";
import {useTranslation} from "@enterprise_search/recoil_translation";
import {debugLog} from "@enterprise_search/recoil_utils";

export type DropdownValueProps<T> = StringValueProps<T> & {
    options: string[];
    labelPrefix?: string; // Optional prefix for translation
};

export type EditStringDropdownComponent = <T, >(props: DropdownValueProps<T>) => React.ReactElement;
export const EditStringDropdown: EditStringDropdownComponent =
    <T, >({atom, atomKey, rootId, options, labelPrefix = '',}: DropdownValueProps<T>) => {
        const [value, setValue] = useRecoilState(keySelector({atom, key: atomKey}));
        const translate = useTranslation();

        const inputId = `${rootId}.${atomKey.toString()}`;
        const computedLabel = translate(`${labelPrefix}${inputId}`);
        debugLog('rerendering dropdown', inputId, computedLabel);

        const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
            setValue(event.target.value as T[typeof atomKey]);
        };

        return (
            <div>
                <label htmlFor={inputId} style={{display: "block", marginBottom: "0.5rem"}}>
                    {computedLabel}
                </label>
                <select
                    id={inputId}
                    value={value as string || ''}
                    onChange={handleChange}
                    style={{display: "block", marginBottom: "1rem", padding: "0.5rem", width: "100%"}}
                >
                    {options.map((option) => (
                        <option key={option} value={option}>
                            {translate(`${labelPrefix}${inputId}.${option}`)}
                        </option>
                    ))}
                </select>
            </div>
        );
    };