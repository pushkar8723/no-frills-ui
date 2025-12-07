import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { getThemeValue, THEME_NAME } from '../../shared/constants';

const Label = styled.label`
    display: inline-flex;
    align-items: center;
    margin: 5px 0;
`;

const Input = styled.input`
    appearance: none;
    margin: 0;

    &::before {
        content: ' ';
        width: 16px;
        height: 16px;
        margin: 0 5px;
        border: 1px solid ${getThemeValue(THEME_NAME.BORDER_COLOR)};
        border-radius: 50%;
        display: block;
        transition: background-color 0.3s ease;
    }

    /* checked */
    &:checked::before {
        border: 1px solid ${getThemeValue(THEME_NAME.PRIMARY)};
        background-color: ${getThemeValue(THEME_NAME.PRIMARY)};
        box-shadow: inset 0 0 0 3px ${getThemeValue(THEME_NAME.BACKGROUND)};
    }

    /* focus */
    &:enabled:focus::before {
        border: 1px solid ${getThemeValue(THEME_NAME.PRIMARY)};
        box-shadow: 0 0 0 3px ${getThemeValue(THEME_NAME.PRIMARY_LIGHT)};
        cursor: pointer;
    }

    &:enabled:checked:focus::before {
        border: 1px solid ${getThemeValue(THEME_NAME.PRIMARY)};
        box-shadow:
            0 0 0 3px ${getThemeValue(THEME_NAME.PRIMARY_LIGHT)},
            inset 0 0 0 3px ${getThemeValue(THEME_NAME.BACKGROUND)};
        cursor: pointer;
    }

    /* hover */
    &:enabled:hover::before {
        border: 1px solid ${getThemeValue(THEME_NAME.PRIMARY)};
        cursor: pointer;
    }

    &:enabled:hover + span {
        color: ${getThemeValue(THEME_NAME.PRIMARY)};
        cursor: pointer;
    }

    /* disabled */
    &:disabled::before {
        border: 1px solid ${getThemeValue(THEME_NAME.DISABLED_BORDER)};
        background-color: ${getThemeValue(THEME_NAME.LIGHT_GREY)};
    }

    &:disabled:checked::before {
        border: 1px solid ${getThemeValue(THEME_NAME.DISABLED_BORDER)};
        background-color: ${getThemeValue(THEME_NAME.DISABLED_BORDER)};
        box-shadow: inset 0 0 0 3px ${getThemeValue(THEME_NAME.BACKGROUND)};
    }

    &:disabled + span {
        color: ${getThemeValue(THEME_NAME.DISABLED_BORDER)};
    }
`;

function Radio(
    props: PropTypes.InferProps<React.AllHTMLAttributes<HTMLInputElement> & typeof Radio.propTypes>,
) {
    return (
        <Label>
            <Input {...props} type="radio" />
            <span>{props.label}</span>
        </Label>
    );
}

Radio.propTypes = {
    /** Label for the field */
    label: PropTypes.string,
};

export default Radio;
