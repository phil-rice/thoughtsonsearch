import {GetterSetter, Setter} from "@enterprise_search/react_utils";
import {LensAndPath} from "./lens";

export function makeGetterSetter<Main, T>(t: Main, setter: Setter<Main>, lens: LensAndPath<Main, T>): GetterSetter<T> {
    return [lens.get(t), (v) => {
        if (typeof v === 'function') {
            setter(main => lens.set(main, (v as (t: T) => T)(lens.get(main))));
        } else {
            setter(lens.set(t, v));
        }
    }]
}