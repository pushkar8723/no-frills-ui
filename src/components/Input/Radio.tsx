import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

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
        border: 1px solid var(--border-color, #555);
        border-radius: 50%;
        display: block;
        transition: background-color .3s ease;
    }

    /* checked */
    &:checked::before {
        border: 1px solid var(--primary, #2283d2);
        background-color: var(--primary, #2283d2);
        box-shadow: inset 0 0 0 3px var(--background, #fff);
    }

    /* focus */
    &:enabled:focus::before {
        border: 1px solid var(--primary, #2283d2);
        box-shadow: 0 0 0 3px var(--primary-light, #64baff);
        cursor: pointer;
    }

    &:enabled:checked:focus::before {
        border: 1px solid var(--primary, #2283d2);
        box-shadow: 0 0 0 3px var(--primary-light, #64baff),
            inset 0 0 0 3px var(--background, #fff);
        cursor: pointer;
    }

    /* hover */
    &:enabled:hover::before {
        border: 1px solid var(--primary, #2283d2);
        cursor: pointer;
    }

    &:enabled:hover + span {
        color: var(--primary, #2283d2);
        cursor: pointer;
    }

    /* disabled */
    &:disabled::before {
        border: 1px solid #aaa;
        background-color: #ccc;
    }

    &:disabled:checked::before {
        border: 1px solid #aaa;
        background-color: #aaa;
        box-shadow: inset 0 0 0 3px var(--background, #fff);
    }

    &:disabled + span {
        color: #aaa;
    }
`;

function Radio(props: PropTypes.InferProps<typeof Radio.propTypes>) {
    return (
        <Label>
            <Input {...props} type='radio' />
            <span>{props.label}</span>
        </Label>
    );
}

Radio.propTypes = {
    /** Label for the field */
    label: PropTypes.string,
}

export default Radio;
