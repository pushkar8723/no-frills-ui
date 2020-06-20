import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const Switch = styled.label`
    position: relative;
    display: inline-flex;
`;

const Input = styled.input`
    appearance: none;
    margin: 0;

    & + span {
        position: relative;
        cursor: pointer;
        width: 30px;
        height: 18px;
        background-color: #ccc;
        transition: .4s;
        border-radius: 10px;
        padding: 0 3px;
        margin-right: 10px;
    }
    & + span:before {
        position: absolute;
        content: "";
        height: 14px;
        width: 14px;
        left: 1px;
        top: 1px;
        border: 1px solid #aaa;
        border-radius: 50%;
        background-color: #fff;
        transition: .4s;
    }

    /* checked */
    &:checked + span {
        background-color: var(--primary-light, #64baff);
    }

    &:checked + span:before {
        transform: translateX(18px);
        border-color: var(--primary, #2283d2);
    }

    /* focus */
    &:enabled:focus + span:before {
        box-shadow: 0 0 0 3px var(--primary-light, #64baff);
        border-color: var(--primary, #2283d2);
    }

    /* hover */
    &:enabled:hover ~ span {
        cursor: pointer;
        color: var(--primary, #2283d2);
    }

    /* disabled */
    &:disabled ~ span {
        color: #aaa;
    }

    &:disabled + span {
        background-color: #ccc;
        cursor: not-allowed;
    }
    
    &:disabled + span:before {
        background-color: #eee;
        border-color: #aaa;
    }
`;


type ToggleProps = PropTypes.InferProps<typeof Toggle.propTypes>;

function Toggle(props: ToggleProps) {
    return (
        <Switch>
            <Input {...props} type='checkbox' />
            <span></span>
            <span>{props.label}</span>
        </Switch>
    );
}

Toggle.propTypes = {
    /** Label for the field */
    label: PropTypes.string,
}

export default Toggle;
