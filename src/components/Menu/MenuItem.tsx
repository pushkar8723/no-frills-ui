import React, { ReactNode, SyntheticEvent, useContext } from 'react';
import styled from '@emotion/styled';
import MenuContext from './MenuContext';
import constants from '../../shared/constants';
import { Checkbox } from '../Input';
import { ReactElementLike } from 'prop-types';

interface MenuItemProps<T> {
    value: T;
    children: ReactElementLike;
}

const Container = styled.button<{selected: boolean}>`
    font-weight: ${props => props.selected ? 'bold' : 'normal'};
    padding: 8px 6px;
    border: none;
    background-color: transparent;
    font-size: 16px;
    border-bottom: 1px solid var(--border-light-color, ${constants.BORDER_LIGHT_COLOR});
    min-height: 41px;
    display: flex;
    align-items: center;
    cursor: pointer;
    position: relative;

    &:hover, &:focus, &:focus-within {
        background-color: var(--border-light-color, ${constants.BORDER_LIGHT_COLOR});
    }

    & > label {
        margin: 0 4px 0 0;
    }
`;

export default function MenuItem<T>(props: MenuItemProps<T>) {
    const context = useContext(MenuContext);
    const { value, children, ...rest } = props;
    const clickHandler = (e: SyntheticEvent) => {
        e.stopPropagation();
        if (context.multiSelect) {
            e.nativeEvent.stopImmediatePropagation();
        }
        context.updateValue(value);
    };

    const selected = context.multiSelect ? context.value?.includes?.(value) : context.value === value;

    return (
        <Container {...rest} type='button' tabIndex={context.multiSelect ? -1 : 0} selected={selected} onClick={clickHandler}>
            {context.multiSelect  && <Checkbox checked={selected} />}
            {props.children}
        </Container>
    )
}
