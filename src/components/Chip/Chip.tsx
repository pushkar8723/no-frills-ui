import React from 'react';
import styled from '@emotion/styled';
import { Close } from '../../icons';
import constants from '../../shared/constants';

interface ChipProps {
    /** Label for the chip */
    label: string;
    /** Callback when the close button is clicked */
    onCloseClick?: () => void;
    /** Aria label for the close button. Defaults to "Remove {label}" */
    closeButtonAriaLabel?: string;
}

const Container = styled.span`
    padding: 5px;
    padding-left: 15px;
    border-radius: 16px;
    background-color: var(--border-light-color, ${constants.BORDER_LIGHT_COLOR});
    display: inline-flex;
    margin: 5px;
    line-height: 20px;
    align-items: center;

    &:focus-within {
        outline: 2px solid var(--primary-light, ${constants.PRIMARY_LIGHT});
    }
`;

const Button = styled.button`
    color: var(--background-color, ${constants.BACKGROUND});
    background-color: var(--border-color, ${constants.DISABLED});
    border-radius: 50%;
    border: none;
    padding: 4px;
    display: inline-flex;
    margin-left: 5px;
`;

export default function Chip(props: ChipProps) {
    const { label, onCloseClick, closeButtonAriaLabel, ...rest } = props;

    const keyUpHandler: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
        if (e.key === 'Backspace' || e.key === 'Delete') {
            onCloseClick?.();
        }
    };

    return (
        <Container {...rest} onKeyUp={keyUpHandler}>
            {label}
            <Button onClick={onCloseClick} aria-label={closeButtonAriaLabel ?? `Remove ${label}`}>
                <Close height={16} width={16} />
            </Button>
        </Container>
    );
}
