import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import constants from '../../shared/constants';

const Input = styled.input`
    appearance: none;
    margin: 0;
    width: 0;

    & + span {
        color: var(--primary, ${constants.PRIMARY});
        padding: 6px 12px;
        border: none;
        border: 1px solid var(--primary, ${constants.PRIMARY});
        cursor: pointer;
        margin-right: -1px;
        line-height: 18px;
    }

    &:enabled:focus + span {
        box-shadow: 0 0 0 4px var(--primary, ${constants.PRIMARY_LIGHT});
    }

    &:enabled:hover + span {
        background-color: var(--primary, ${constants.PRIMARY_LIGHT});
        color: #fff;
    }

    &:enabled:checked + span {
        background-color: var(--primary, ${constants.PRIMARY});
        color: #fff;
    }

    &:disabled + span {
        background-color: var(--border-light-color, ${constants.BORDER_LIGHT_COLOR});
        color: var(--disabled-border, ${constants.DISABLED_BORDER});
    }

    &:disabled:checked + span {
        background-color: var(--disabled-border, ${constants.DISABLED_BORDER});
        color: #fff;
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

    & ${Label}:first-child > span {
        border-radius: 3px 0 0 3px;
    }

    & ${Label}:last-child > span {
        border-radius: 0 3px 3px 0;
    }
`;

function RadioButton(props: PropTypes.InferProps<React.AllHTMLAttributes<HTMLInputElement> & typeof RadioButton.propTypes>) {
    return (
        <Label>
            <Input {...props} type='radio' />
            <span>{props.label}</span>
        </Label>
    );
}

RadioButton.propTypes = {
    /** Label for the field */
    label: PropTypes.string,
}

export default RadioButton;
