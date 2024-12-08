import {RecoilState, useRecoilState} from "recoil";
import {keySelector} from "./selector";
import {useTranslation} from "../translation/translation";
import {debugLog} from "../utils/debug";
import {ChangeEventHandler} from "react";

export type StringValueProps<T> = {
    atom: RecoilState<T>;
    atomKey: {
        [K in keyof T]: T[K] extends string | undefined ? K : never
    }[keyof T]; // Restrict atomKey to only keys pointing to string or string | undefined values
    rootId: string;
};

export type StringValueComponent = <T>(props: StringValueProps<T>) => React.ReactElement;


export const StringValue: StringValueComponent = <T, >({atom, atomKey, rootId}: StringValueProps<T>) => {
    const [value, setValue] = useRecoilState(keySelector({atom, key: atomKey}));
    const translate = useTranslation();
    const inputId = `${rootId}.${atomKey as string}`;
    const computedLabel = translate(inputId);
    debugLog('rerendering attribute value', inputId, computedLabel);
    const onChange: ChangeEventHandler<HTMLInputElement> =
        (e) => setValue(e.target.value as T[typeof atomKey]);
    return (
        <div>
            <label htmlFor={inputId} style={{display: "block", marginBottom: "0.5rem"}}>{computedLabel}</label>
            <input
                id={inputId}
                type="text"
                value={value as string}
                onChange={onChange}
                style={{display: "block", marginBottom: "1rem", padding: "0.5rem", width: "100%"}}
            />
        </div>
    );
};
