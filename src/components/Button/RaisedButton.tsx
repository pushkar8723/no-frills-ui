import React from 'react';
import styled from '@emotion/styled';
import { getThemeValue, THEME_NAME } from '../../shared/constants';

const StyledRaisedButton = styled.button`
    border: 1px solid ${getThemeValue(THEME_NAME.BORDER_COLOR)};
    border-radius: 5px;
    height: 32px;
    min-width: 100px;
    font-size: 14px;
    text-align: center;
    padding: 0 12px;
    cursor: ${getThemeValue(THEME_NAME.TEXT_COLOR_DARK)};
    color: inherit;
    background-color: ${getThemeValue(THEME_NAME.BACKGROUND)};
    transform: translateY(-2px);
    box-shadow: ${getThemeValue(THEME_NAME.HOVER_SHADOW)};
    margin: 5px;
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;

    & svg {
        vertical-align: middle;
        height: 24px;
        width: 24px;
        margin-left: -6px;
        fill: currentColor;
    }

    &:enabled:hover {
        border-color: ${getThemeValue(THEME_NAME.PRIMARY)};
        color: ${getThemeValue(THEME_NAME.PRIMARY)};
    }

    &:focus {
        border-color: ${getThemeValue(THEME_NAME.PRIMARY)};
    }

    &:disabled {
        background-color: ${getThemeValue(THEME_NAME.DISABLED_BACKGROUND)};
        border-color: ${getThemeValue(THEME_NAME.LIGHT_GREY)};
        color: ${getThemeValue(THEME_NAME.DISABLED)};
    }

    &:active {
        transform: translateY(0);
        box-shadow: ${getThemeValue(THEME_NAME.SHADOW)};
    }
`;

type RaisedButtonProps = {
    /**
     * Type of Raised Button
     * @default 'button'
     */
    type?: 'button' | 'submit' | 'reset';
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * RaisedButton Component
 * @param props - Component props
 * @param ref - Ref forwarded to the underlying HTMLButtonElement
 */
const RaisedButtonComponent = (props: RaisedButtonProps, ref: React.Ref<HTMLButtonElement>) => {
    const { type = 'button', ...rest } = props;

    return <StyledRaisedButton ref={ref} type={type} {...rest} />;
};

const RaisedButton = React.forwardRef<HTMLButtonElement, RaisedButtonProps>(RaisedButtonComponent);
export default RaisedButton;
