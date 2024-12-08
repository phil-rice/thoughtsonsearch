import {RecoilState, selectorFamily} from "recoil";

export const keySelector = selectorFamily({
  key: 'keySelector',
  get:
      <T, K extends keyof T>(params: { atom: RecoilState<T>; key: K }) =>
          ({ get }) => {
            const { atom, key } = params;
            const state = get(atom);
            return state[key];
          },
  set:
      <T, K extends keyof T>(params: { atom: RecoilState<T>; key: K }) =>
          ({ get, set }, newValue) => {
            const { atom, key } = params;
            const state = get(atom);
            set(atom, { ...state, [key]: newValue });
          },
});