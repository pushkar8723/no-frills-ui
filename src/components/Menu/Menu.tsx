import React, { createContext, useState, ReactNode } from 'react';
import styled from '@emotion/styled';
import MenuContext from './MenuContext';
import MenuItem from './MenuItem';

interface MenuProps<T> {
    /** Multiple Menu Items can be selected */
    multiSelect: boolean;
    /** Value(s) selected */
    value: T | T[];
    /** Callback when the selected value changes */
    onChange?: (value: T | T[]) => void;
    /** Menu Items */
    children?: ReactNode;
}

const MenuContainer = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;

    & div:last-child {
        border-bottom: none;
    }
`;

export default function Menu<T>(props: MenuProps<T>) {
    const { multiSelect, onChange } = props;
    const [value, setValue] = useState(props.value || (multiSelect ? [] : ''));

    const updateValue = (val: T) => {
        let newVal;
        if (multiSelect) {
            if (Array.isArray(value)) {
                if (value.includes(val)) {
                    newVal = value.filter(item => item !== val);
                } else {
                    newVal = [...value, val];
                }
            }
        } else {
            newVal = val;
        }
        setValue(newVal);
        onChange?.(newVal);
    }

    return (
        <MenuContext.Provider value={{
            value,
            multiSelect,
            updateValue
        }}>
            <MenuContainer>
                {props.children}
            </MenuContainer>
        </MenuContext.Provider>
    )
}

Menu.defaultProps = {
    multiSelect: false,
} 
