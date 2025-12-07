import React from 'react';
import styled from '@emotion/styled';
import { Close } from '../../icons';
import { getThemeValue, THEME_NAME } from '../../shared/constants';

interface ChipProps {
    /** Label for the chip */
    label: string;
    /** Callback when the close button is clicked */
    onCloseClick?: (e: React.KeyboardEvent | React.MouseEvent) => void;
    /** Aria label for the close button. Defaults to "Remove {label}" */
    closeButtonAriaLabel?: string;
}

const Container = styled.span`
    padding: 5px;
    padding-left: 15px;
    border-radius: 16px;
    background-color: ${getThemeValue(THEME_NAME.BORDER_LIGHT_COLOR)};
    display: inline-flex;
    margin: 5px;
    line-height: 20px;
    align-items: center;
`;

const Button = styled.button`
    color: ${getThemeValue(THEME_NAME.BACKGROUND)};
    background-color: ${getThemeValue(THEME_NAME.DISABLED)};
    border-radius: 50%;
    border: none;
    padding: 4px;
    display: inline-flex;
    margin-left: 5px;

    &:focus-within {
        outline: 4px solid ${getThemeValue(THEME_NAME.ERROR_LIGHT)};
    }
`;

export default function Chip(props: ChipProps & React.HTMLAttributes<HTMLSpanElement>) {
    const { label, onCloseClick, closeButtonAriaLabel, ...rest } = props;

    const keyUpHandler: React.KeyboardEventHandler<HTMLSpanElement> = (e) => {
        if (e.key === 'Backspace' || e.key === 'Delete') {
            onCloseClick?.(e);
        }
    };

    const buttonKeyDownHandler: React.KeyboardEventHandler<HTMLButtonElement> = (e) => {
        // Stop propagation to prevent DragAndDrop from capturing Space/Enter
        if (e.key === ' ' || e.key === 'Spacebar' || e.key === 'Enter') {
            e.stopPropagation();
        }
    };

    return (
        <Container {...rest} onKeyUp={keyUpHandler}>
            {label}
            <Button
                onClick={onCloseClick}
                onKeyDown={buttonKeyDownHandler}
                aria-label={closeButtonAriaLabel ?? `Remove ${label}`}
            >
                <Close height={16} width={16} />
            </Button>
        </Container>
    );
}
