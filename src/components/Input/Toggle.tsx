import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import constants from '../../shared/constants';

const Switch = styled.label`
    position: relative;
    display: inline-flex;
    margin: 5px 0;
`;

const Input = styled.input`
    appearance: none;
    margin: 0;

    & + span {
        position: relative;
        cursor: pointer;
        width: 30px;
        height: 18px;
        background-color: ${constants.LIGHT_GREY};
        transition: 0.4s;
        border-radius: 10px;
        padding: 0 3px;
        margin: 0 10px 0 5px;
    }
    & + span:before {
        position: absolute;
        content: '';
        height: 14px;
        width: 14px;
        left: 1px;
        top: 1px;
        border: 1px solid var(--disabled-border, ${constants.DISABLED_BORDER});
        border-radius: 50%;
        background-color: var(--background, ${constants.BACKGROUND});
        transition: 0.4s;
    }

    /* checked */
    &:checked + span {
        background-color: var(--primary, ${constants.PRIMARY_LIGHT});
    }

    &:checked + span:before {
        transform: translateX(18px);
        border-color: var(--primary, ${constants.PRIMARY});
    }

    /* focus */
    &:enabled:focus + span:before {
        box-shadow: 0 0 0 3px var(--primary, ${constants.PRIMARY_LIGHT});
        border-color: var(--primary, ${constants.PRIMARY});
    }

    /* hover */
    &:enabled:hover ~ span {
        cursor: pointer;
        color: var(--primary, ${constants.PRIMARY});
    }

    /* disabled */
    &:disabled ~ span {
        color: var(--disabled-border, ${constants.DISABLED_BORDER});
    }

    &:disabled + span {
        background-color: ${constants.LIGHT_GREY};
        cursor: not-allowed;
    }

    &:disabled + span:before {
        background-color: var(--border-light-color, ${constants.BORDER_LIGHT_COLOR});
        border-color: var(--disabled-border, ${constants.DISABLED_BORDER});
    }
`;

type ToggleProps = PropTypes.InferProps<
    React.AllHTMLAttributes<HTMLInputElement> & typeof Toggle.propTypes
>;

function Toggle(props: ToggleProps) {
    return (
        <Switch>
            <Input {...props} type="checkbox" />
            <span></span>
            <span>{props.label}</span>
        </Switch>
    );
}

Toggle.propTypes = {
    /** Label for the field */
    label: PropTypes.string,
};

export default Toggle;
