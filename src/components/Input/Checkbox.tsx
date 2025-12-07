import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { getThemeValue, THEME_NAME } from '../../shared/constants';

const Label = styled.label`
    margin: 5px 0;
    position: relative;
`;

const Input = styled.input`
    appearance: none;
    position: relative;
    margin: 0;

    &::before {
        content: '';
        width: 16px;
        height: 16px;
        border: 1px solid ${getThemeValue(THEME_NAME.BORDER_COLOR)};
        display: inline-block;
        border-radius: 3px;
        vertical-align: bottom;
        margin: 0 5px;
        text-align: center;
        line-height: 16px;
        background-color: ${getThemeValue(THEME_NAME.BACKGROUND)};
        transition: background-color 0.3s ease;
    }

    &::after {
        content: '';
        width: 3px;
        height: 10px;
        border-right: 2px solid ${getThemeValue(THEME_NAME.TEXT_COLOR_LIGHT)};
        border-bottom: 2px solid ${getThemeValue(THEME_NAME.TEXT_COLOR_LIGHT)};
        transform: translate(-16px, 1px);
        opacity: 0;
        transition: transform 0.3s ease;
        position: absolute;
    }

    /** checked */
    &:checked::before {
        content: '';
        background-color: ${getThemeValue(THEME_NAME.PRIMARY)};
        border-color: ${getThemeValue(THEME_NAME.PRIMARY)};
        color: ${getThemeValue(THEME_NAME.TEXT_COLOR_LIGHT)};
    }

    &:checked::after {
        opacity: 1;
        transform: translate(-16px, 2px) rotate(45deg);
    }

    /** indeterminate */
    &:indeterminate::before {
        content: '';
        background-color: ${getThemeValue(THEME_NAME.PRIMARY)};
        border-color: ${getThemeValue(THEME_NAME.PRIMARY)};
        color: ${getThemeValue(THEME_NAME.TEXT_COLOR_LIGHT)};
    }

    &:indeterminate::after {
        width: 0;
        opacity: 1;
        transform: translate(-15px, 3px) rotate(90deg);
    }

    /** active and focus */
    &:enabled:active::before,
    &:focus::before {
        border-color: ${getThemeValue(THEME_NAME.PRIMARY)};
        box-shadow: 0 0 0 3px ${getThemeValue(THEME_NAME.PRIMARY_LIGHT)};
    }

    &:enabled:active + span,
    &:focus + span {
        color: ${getThemeValue(THEME_NAME.PRIMARY)};
    }

    /** hover */
    &:enabled:hover::before {
        border-color: ${getThemeValue(THEME_NAME.PRIMARY)};
    }

    &:enabled:hover + span {
        color: ${getThemeValue(THEME_NAME.PRIMARY)};
    }

    /** disabled */
    &:disabled::before {
        border-color: ${getThemeValue(THEME_NAME.DISABLED_BORDER)};
    }

    &:disabled + span {
        color: ${getThemeValue(THEME_NAME.DISABLED)};
    }

    &:checked:disabled::before,
    &:indeterminate:disabled::before {
        background-color: ${getThemeValue(THEME_NAME.DISABLED)};
    }
`;

type CheckboxProps = Omit<React.HTMLProps<HTMLInputElement>, 'as'> &
    PropTypes.InferProps<typeof Checkbox.propTypes>;

export default function Checkbox(props: CheckboxProps) {
    const ref = useCallback(
        (node: unknown) => {
            if (node !== null) {
                if (props.indeterminate) {
                    (node as HTMLInputElement).indeterminate = true;
                }
            }
        },
        [props.indeterminate],
    );

    return (
        <Label>
            <Input
                {...props}
                ref={ref}
                type="checkbox"
                aria-checked={props.indeterminate ? 'mixed' : props.checked}
            />
            <span>{props.label}</span>
        </Label>
    );
}

Checkbox.propTypes = {
    /** Label for the field */
    label: PropTypes.string,
    /** If the field is in indeterminate state */
    indeterminate: PropTypes.bool,
};

Checkbox.defaultProps = {
    indeterminate: false,
    label: '',
};
