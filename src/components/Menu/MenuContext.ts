import { createContext } from 'react';

export interface MenuContext<T> {
    value: T | T[];
    multiSelect: boolean;
    updateValue: (newVal: T) => void;
}

export default createContext<MenuContext<any>>(undefined);
