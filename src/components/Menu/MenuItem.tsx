import React, { SyntheticEvent, useContext } from 'react';
import styled from '@emotion/styled';
import { getThemeValue, THEME_NAME } from '../../shared/constants';
import Checkbox from '../Input/Checkbox';
import MenuContext, { MenuContextType } from './MenuContext';

interface MenuItemProps<T> {
    /** Value of the element */
    value: T & T[];
}

const Container = styled.button<{ selected: boolean }>`
    font-weight: ${(props) => (props.selected ? 'bold' : 'normal')};
    padding: 8px 6px;
    border: none;
    background-color: transparent;
    font-size: 16px;
    border-bottom: 1px solid ${getThemeValue(THEME_NAME.BORDER_LIGHT_COLOR)};
    min-height: 41px;
    display: flex;
    align-items: center;
    cursor: pointer;
    position: relative;

    &:hover,
    &:focus,
    &:focus-within {
        background-color: ${getThemeValue(THEME_NAME.BORDER_LIGHT_COLOR)};
    }

    & > label {
        margin: 0 4px 0 0;
    }
`;

export default function MenuItem<T>(props: MenuItemProps<T> & React.PropsWithChildren<unknown>) {
    const context = useContext(MenuContext) as MenuContextType<T>;
    const { value, children, ...rest } = props;
    const clickHandler = (e: SyntheticEvent) => {
        e.stopPropagation();
        if (context.multiSelect) {
            e.nativeEvent.stopImmediatePropagation();
        }
        context.updateValue(value);
    };

    const selected = context.multiSelect
        ? context.value?.includes?.(value)
        : context.value === value;

    return (
        <Container
            {...rest}
            type="button"
            tabIndex={context.multiSelect ? -1 : 0}
            selected={selected}
            onClick={clickHandler}
        >
            {context.multiSelect && <Checkbox checked={selected} />}
            {children}
        </Container>
    );
}
