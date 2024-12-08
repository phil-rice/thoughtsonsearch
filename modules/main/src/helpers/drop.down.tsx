import {useRecoilState} from "recoil";
import {StringValueProps} from "./string.value";
import {keySelector} from "./selector";
import {useTranslation} from "../translation/translation";
import {debugLog} from "../utils/debug";

export type DropdownValueProps<T extends Record<string, any>> = StringValueProps<T> & {
    options: string[];
    labelPrefix?: string; // Optional prefix for translation
};

export const DropdownValue = <T extends Record<string, any>>({
                                                                 atom,
                                                                 atomKey,
                                                                 rootId,
                                                                 options,

                                                                 labelPrefix = '',
                                                             }: DropdownValueProps<T>) => {
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