import {LensAndPath} from "@enterprise_search/optics";
import {GetterSetter, Setter} from "./react_utils";

export function makeGetterSetter<Main, T>(t: Main, setter: Setter<Main>, lens: LensAndPath<Main, T>): GetterSetter<T> {
    return [lens.get(t), (v) => {
        if (typeof v === 'function') {
            setter(main => lens.set(main, (v as (t: T) => T)(lens.get(main))));
        } else {
            setter(lens.set(t, v));
        }
    }]
}