import { createContext } from 'react';

type SingleSelect<T> = {
    value: T;
    multiSelect: false;
    updateValue: (newVal: T) => void;
};

type MultiSelect<T> = {
    value: T[];
    multiSelect: true;
    updateValue: (newVal: T[]) => void;
};
export type MenuContextType<T> = SingleSelect<T> | MultiSelect<T>;

export default createContext<MenuContextType<object>>(undefined);
