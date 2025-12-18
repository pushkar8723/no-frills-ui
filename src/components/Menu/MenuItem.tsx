import React, { SyntheticEvent, useContext } from 'react';
import styled from '@emotion/styled';
import { getThemeValue, THEME_NAME } from '../../shared/constants';
import Checkbox from '../Input/Checkbox';
import MenuContext, { MenuContextType } from './MenuContext';

type MenuItemProps<T> = {
    /** Value of the element */
    value: T;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Container = styled.button<{ selected: boolean; multiselect?: boolean }>`
    font-weight: ${(props) => (props.selected ? 'bold' : 'normal')};
    padding: 8px;
    border: none;
    border-left: 4px solid
        ${(props) =>
            props.selected && !props.multiselect
                ? getThemeValue(THEME_NAME.TEXT_COLOR_DARK)
                : 'transparent'};
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

const MenuItemInner = <T,>(props: MenuItemProps<T>, ref: React.Ref<HTMLButtonElement>) => {
    const context = useContext(MenuContext) as MenuContextType<T> | undefined;
    if (!context) {
        throw new Error('`MenuItem` must be used within a `Menu` provider');
    }
    const { value, children, ...rest } = props;
    const clickHandler = (e: SyntheticEvent) => {
        e.stopPropagation();
        context.updateValue(value as T);
    };

    let selected = false;
    if (context.multiSelect) {
        const arr = context.value as unknown as T[] | undefined;
        selected = Array.isArray(arr) && arr.includes(value as unknown as T);
    } else {
        selected = (context.value as unknown as T) === value;
    }

    return (
        <Container
            {...rest}
            ref={ref}
            type="button"
            role="option"
            aria-selected={selected}
            selected={selected}
            onClick={clickHandler}
            multiselect={context.multiSelect ? true : undefined}
        >
            {context.multiSelect && (
                <Checkbox
                    checked={selected}
                    readOnly
                    tabIndex={-1}
                    onClick={(e) => e.stopPropagation()}
                />
            )}
            {children}
        </Container>
    );
};

const MenuItem = React.forwardRef(MenuItemInner);
export default MenuItem;
