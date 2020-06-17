import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Switch = styled.label`
    position: relative;
    display: inline-flex;
`;

const Input = styled.input`
    appearance: none;
    margin: 0;

    & + .slider {
        position: relative;
        cursor: pointer;
        width: 30px;
        height: 18px;
        background-color: #ccc;
        transition: .4s;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 3px;
        margin-right: 10px;
    }
    & + .slider:before {
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
    &:checked + .slider {
        background-color: var(--primary-light, #64baff);
    }

    &:checked + .slider:before {
        transform: translateX(18px);
        border: 1px solid var(--primary, #2283d2);
    }

    /* focus */
    &:enabled:focus + .slider:before {
        box-shadow: 0 0 0 3px var(--primary-light, #64baff);
        border: 1px solid var(--primary, #2283d2);
    }

    /* disabled */
    &:disabled ~ span {
        color: #aaa;
    }

    &:disabled + .slider {
        background-color: #ccc;
        cursor: not-allowed;
    }
    
    &:disabled + .slider:before {
        background-color: #eee;
        border: 1px solid #aaa;
    }
`;


type ToggleProps = PropTypes.InferProps<typeof Toggle.propTypes>;

function Toggle(props: ToggleProps) {
    return (
        <Switch>
            <Input type='checkbox' {...props} />
            <span className='slider'></span>
            <span>{props.label}</span>
        </Switch>
    );
}

Toggle.propTypes = {
    /** Label for the field */
    label: PropTypes.string,
}

export default Toggle;
