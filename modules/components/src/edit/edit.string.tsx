import {RecoilState, useRecoilState} from "recoil";
import {keySelector} from "./selector";

import {ChangeEventHandler, ReactElement} from "react";
import {useTranslation} from "@enterprise_search/recoil_translation";
import {debugLog} from "@enterprise_search/recoil_utils";

export type StringValueProps<T> = {
    atom: RecoilState<T>;
    atomKey: {
        [K in keyof T]: T[K] extends string | undefined ? K : never
    }[keyof T]; // Restrict atomKey to only keys pointing to string or string | undefined values
    rootId: string;
};

export type EditStringInputComponent = <T>(props: StringValueProps<T>) => ReactElement;


export const EditStringInput: EditStringInputComponent = <T, >({atom, atomKey, rootId}: StringValueProps<T>) => {
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
