import React from 'react';
import styled from '@emotion/styled';
import constants from '../../shared/constants';
import { Close } from '../../icons';

interface ChipProps {
    label: string;
    onCloseClick?: () => void;
}

const Container = styled.div`
    padding: 5px;
    border-radius: 16px;
    background-color: var(--border-light-color, ${constants.BORDER_LIGHT_COLOR});
    display: inline-flex;
    margin: 5px;
    line-height: 20px;
    align-items: center;

    &:focus-within {
        background-color: var(--light-grey, ${constants.LIGHT_GREY});
    }
`;

const Button = styled.button`
    color: #fff;
    background-color: var(--disabled-border, ${constants.DISABLED_BORDER});
    border-radius: 50%;
    border: none;
    padding: 0;
    display: inline-flex;
    margin-left: 5px;
`;

export default function Chip(props: ChipProps) {
    const { label, onCloseClick, ...rest } = props;

    const keyUpHandler:React.KeyboardEventHandler<HTMLDivElement> = (e) => {
        if (e.keyCode === 8 || e.keyCode === 46) {
            onCloseClick?.();
        }
    }

    return (
        <Container {...rest} onKeyUp={keyUpHandler}>
            {label}
            <Button onClick={onCloseClick}><Close height={20} width={20} /></Button>
        </Container>
    );
}
