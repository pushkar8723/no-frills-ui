import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const Input = styled.input`
    appearance: none;
    margin: 0;
    width: 0;

    & + span {
        color: var(--primary, #2283d2);
        padding: 6px 12px;
        border: none;
        border: 1px solid var(--primary, #2283d2);
        cursor: pointer;
        margin-right: -1px;
        line-height: 18px;
    }

    &:enabled:focus + span {
        box-shadow: 0 0 0 4px var(--primary-light, #64baff);
    }

    &:enabled:hover + span {
        background-color: var(--primary-light, #64baff);
        color: #fff;
    }

    &:enabled:checked + span {
        background-color: var(--primary, #2283d2);
        color: #fff;
    }

    &:disabled + span {
        background-color: #eee;
        color: #aaa;
    }

    &:disabled:checked + span {
        background-color: #aaa;
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

function RadioButton(props: PropTypes.InferProps<typeof RadioButton.propTypes>) {
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
