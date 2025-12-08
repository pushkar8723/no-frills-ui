import React, { SyntheticEvent, useContext } from 'react';
import styled from '@emotion/styled';
import { getThemeValue, THEME_NAME } from '../../shared/constants';
import Checkbox from '../Input/Checkbox';
import MenuContext, { MenuContextType } from './MenuContext';

interface MenuItemProps<T> {
    /** Value of the element */
    value: T;
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
    color: ${getThemeValue(THEME_NAME.TEXT_COLOR_DARK)};

    &:hover,
    &:focus,
    &:focus-within {
        background-color: ${getThemeValue(THEME_NAME.BORDER_LIGHT_COLOR)};
    }

    & > label {
        margin: 0 4px 0 0;
    }
`;

const MenuItemInner = <T,>(
    props: MenuItemProps<T> & React.PropsWithChildren,
    ref: React.Ref<HTMLButtonElement>,
) => {
    const context = useContext(MenuContext) as MenuContextType<T>;
    const { value, children, ...rest } = props;
    const clickHandler = (e: SyntheticEvent) => {
        e.stopPropagation();
        if (context.multiSelect) {
            e.nativeEvent.stopImmediatePropagation();
        }
        context.updateValue(value as T & T[]);
    };

    const selected = context.multiSelect
        ? context.value?.includes?.(value)
        : context.value === value;

    return (
        <Container
            {...rest}
            ref={ref}
            type="button"
            role="option"
            aria-selected={selected}
            selected={selected}
            onClick={clickHandler}
        >
            {context.multiSelect && <Checkbox checked={selected} readOnly />}
            {children}
        </Container>
    );
};

const MenuItem = React.forwardRef(MenuItemInner) as <T>(
    props: MenuItemProps<T> & React.PropsWithChildren & { ref?: React.Ref<HTMLButtonElement> },
) => ReturnType<typeof MenuItemInner>;

export default MenuItem;
