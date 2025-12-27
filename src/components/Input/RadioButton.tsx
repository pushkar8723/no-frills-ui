import React from 'react';
import styled from '@emotion/styled';
import { getThemeValue, THEME_NAME } from '../../shared/constants';

const Input = styled.input`
    appearance: none;
    margin: 0;
    width: 0;

    & + span {
        color: ${getThemeValue(THEME_NAME.PRIMARY)};
        padding: 6px 12px;
        border: none;
        border: 1px solid ${getThemeValue(THEME_NAME.PRIMARY)};
        cursor: pointer;
        margin-right: -1px;
        line-height: 18px;
    }

    &:enabled:focus + span {
        box-shadow: 0 0 0 4px ${getThemeValue(THEME_NAME.PRIMARY_LIGHT)};
    }

    &:enabled:hover + span {
        background-color: ${getThemeValue(THEME_NAME.PRIMARY_LIGHT)};
        color: ${getThemeValue(THEME_NAME.TEXT_COLOR_LIGHT)};
    }

    &:enabled:checked + span {
        background-color: ${getThemeValue(THEME_NAME.PRIMARY)};
        color: ${getThemeValue(THEME_NAME.TEXT_COLOR_LIGHT)};
    }

    &:disabled + span {
        background-color: ${getThemeValue(THEME_NAME.BORDER_LIGHT_COLOR)};
        color: ${getThemeValue(THEME_NAME.DISABLED_BORDER)};
    }

    &:disabled:checked + span {
        background-color: ${getThemeValue(THEME_NAME.DISABLED_BORDER)};
        color: ${getThemeValue(THEME_NAME.TEXT_COLOR_LIGHT)};
    }
`;

const Label = styled.label`
    display: inline-flex;

    &:focus-within {
        z-index: 1;
    }
`;

export const RadioGroup = styled.div`
    display: inline-flex;
    align-items: center;
    border-radius: 3px;
    margin: 5px 0;

    & ${Label}:first-of-type > span {
        border-radius: 3px 0 0 3px;
    }

    & ${Label}:last-child > span {
        border-radius: 0 3px 3px 0;
    }
`;

type RadioButtonProps = {
    /** Label for the field */
    label?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

/**
 * RadioButton Component
 * @param props - Component props
 * @param ref - Ref forwarded to the underlying HTMLInputElement
 */
function RadioButtonComponent(props: RadioButtonProps, ref: React.Ref<HTMLInputElement>) {
    const { label, ...rest } = props;
    return (
        <Label>
            <Input {...rest} type="radio" ref={ref} />
            <span>{label}</span>
        </Label>
    );
}

const RadioButton = React.forwardRef(RadioButtonComponent);
export default RadioButton;
