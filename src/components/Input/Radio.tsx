import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { getThemeValue, THEME_NAME } from '../../shared/constants';

const Label = styled.label`
    display: inline-flex;
    align-items: center;
    margin: 5px 0;
    cursor: pointer;
    position: relative;
`;

const StyledRadio = styled.span`
    width: 16px;
    height: 16px;
    margin-right: 5px;
    border: 1px solid ${getThemeValue(THEME_NAME.BORDER_COLOR)};
    border-radius: 50%;
    display: block;
    transition: background-color 0.3s ease;
    position: relative;
    flex-shrink: 0;

    &::after {
        content: '';
        width: 100%;
        height: 100%;
        border-radius: 50%;
        position: absolute;
        top: 0;
        left: 0;
        box-shadow: inset 0 0 0 3px ${getThemeValue(THEME_NAME.BACKGROUND)};
        opacity: 0;
        transition: opacity 0.2s ease;
    }
`;

const HiddenInput = styled.input`
    opacity: 0;
    width: 0;
    height: 0;
    position: absolute;
    margin: 0;

    /* checked */
    &:checked + ${StyledRadio} {
        border-color: ${getThemeValue(THEME_NAME.PRIMARY)};
        background-color: ${getThemeValue(THEME_NAME.PRIMARY)};
    }

    &:checked + ${StyledRadio}::after {
        opacity: 1;
    }

    /* focus */
    &:enabled:focus + ${StyledRadio} {
        border-color: ${getThemeValue(THEME_NAME.PRIMARY)};
        box-shadow: 0 0 0 3px ${getThemeValue(THEME_NAME.PRIMARY_LIGHT)};
    }

    &:enabled:checked:focus + ${StyledRadio} {
        border-color: ${getThemeValue(THEME_NAME.PRIMARY)};
        box-shadow: 0 0 0 3px ${getThemeValue(THEME_NAME.PRIMARY_LIGHT)};
    }

    /* hover */
    &:enabled:hover + ${StyledRadio} {
        border-color: ${getThemeValue(THEME_NAME.PRIMARY)};
    }

    &:enabled:hover ~ span {
        color: ${getThemeValue(THEME_NAME.PRIMARY)};
    }

    /* disabled */
    &:disabled + ${StyledRadio} {
        border-color: ${getThemeValue(THEME_NAME.DISABLED_BORDER)};
        background-color: ${getThemeValue(THEME_NAME.LIGHT_GREY)};
        cursor: not-allowed;
    }

    &:disabled:checked + ${StyledRadio} {
        border-color: ${getThemeValue(THEME_NAME.DISABLED_BORDER)};
        background-color: ${getThemeValue(THEME_NAME.DISABLED_BORDER)};
    }

    &:disabled ~ span {
        color: ${getThemeValue(THEME_NAME.DISABLED_BORDER)};
        cursor: not-allowed;
    }
`;

function Radio(
    props: PropTypes.InferProps<React.AllHTMLAttributes<HTMLInputElement> & typeof Radio.propTypes>,
) {
    return (
        <Label>
            <HiddenInput {...props} type="radio" />
            <StyledRadio />
            <span>{props.label}</span>
        </Label>
    );
}

Radio.propTypes = {
    /** Label for the field */
    label: PropTypes.string,
};

export default Radio;
