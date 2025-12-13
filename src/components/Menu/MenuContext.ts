import { createContext } from 'react';

type SingleSelect<T> = {
    value?: T;
    multiSelect: false;
    updateValue: (newVal: T) => void;
};

type MultiSelect<T> = {
    value?: T[];
    multiSelect: true;
    // updateValue takes a single item and the provider will add/remove it
    updateValue: (newVal: T) => void;
};
export type MenuContextType<T> = SingleSelect<T> | MultiSelect<T>;

// Context may be undefined if used outside a Menu provider
export default createContext<MenuContextType<unknown> | undefined>(undefined);
