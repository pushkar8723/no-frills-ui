import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { getThemeValue, THEME_NAME } from '../../shared/constants';

const Label = styled.label`
    margin: 5px 0;
    position: relative;
    display: inline-flex;
    align-items: center;
    cursor: pointer;
`;

const StyledCheckmark = styled.span`
    width: 16px;
    height: 16px;
    border: 1px solid ${getThemeValue(THEME_NAME.BORDER_COLOR)};
    display: inline-block;
    border-radius: 3px;
    margin-right: 5px;
    background-color: ${getThemeValue(THEME_NAME.BACKGROUND)};
    transition: all 0.3s ease;
    position: relative;
    flex-shrink: 0;

    &::after {
        content: '';
        width: 3px;
        height: 10px;
        border-right: 2px solid ${getThemeValue(THEME_NAME.TEXT_COLOR_LIGHT)};
        border-bottom: 2px solid ${getThemeValue(THEME_NAME.TEXT_COLOR_LIGHT)};
        position: absolute;
        top: 1px;
        left: 6px;
        opacity: 0;
        transform: rotate(45deg) scale(0);
        transition: all 0.2s ease;
    }
`;

const HiddenInput = styled.input`
    opacity: 0;
    width: 0;
    height: 0;
    position: absolute;
    margin: 0;

    /** checked */
    &:checked + ${StyledCheckmark} {
        background-color: ${getThemeValue(THEME_NAME.PRIMARY)};
        border-color: ${getThemeValue(THEME_NAME.PRIMARY)};
    }

    &:checked + ${StyledCheckmark}::after {
        opacity: 1;
        transform: rotate(45deg) scale(1);
    }

    /** indeterminate */
    &:indeterminate + ${StyledCheckmark} {
        background-color: ${getThemeValue(THEME_NAME.PRIMARY)};
        border-color: ${getThemeValue(THEME_NAME.PRIMARY)};
    }

    &:indeterminate + ${StyledCheckmark}::after {
        opacity: 1;
        height: 0;
        width: 8px;
        border-right: none;
        border-bottom: 2px solid ${getThemeValue(THEME_NAME.TEXT_COLOR_LIGHT)};
        transform: rotate(0deg) scale(1);
        top: 7px;
        left: 4px;
    }

    /** active and focus */
    &:enabled:active + ${StyledCheckmark}, &:focus + ${StyledCheckmark} {
        border-color: ${getThemeValue(THEME_NAME.PRIMARY)};
        box-shadow: 0 0 0 3px ${getThemeValue(THEME_NAME.PRIMARY_LIGHT)};
    }

    &:enabled:active ~ span,
    &:focus ~ span {
        color: ${getThemeValue(THEME_NAME.PRIMARY)};
    }

    /** hover */
    &:enabled:hover + ${StyledCheckmark} {
        border-color: ${getThemeValue(THEME_NAME.PRIMARY)};
    }

    &:enabled:hover ~ span {
        color: ${getThemeValue(THEME_NAME.PRIMARY)};
    }

    /** disabled */
    &:disabled + ${StyledCheckmark} {
        border-color: ${getThemeValue(THEME_NAME.DISABLED_BORDER)};
        cursor: not-allowed;
    }

    &:disabled ~ span {
        color: ${getThemeValue(THEME_NAME.DISABLED)};
        cursor: not-allowed;
    }

    &:checked:disabled + ${StyledCheckmark}, &:indeterminate:disabled + ${StyledCheckmark} {
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
            <HiddenInput
                {...props}
                ref={ref}
                type="checkbox"
                aria-checked={props.indeterminate ? 'mixed' : props.checked}
            />
            <StyledCheckmark />
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
