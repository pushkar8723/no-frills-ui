import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import constants from '../../shared/constants';

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
        border: 1px solid var(--border-color, ${constants.BORDER_COLOR});
        border-radius: 50%;
        display: block;
        transition: background-color .3s ease;
    }

    /* checked */
    &:checked::before {
        border: 1px solid var(--primary, ${constants.PRIMARY});
        background-color: var(--primary, ${constants.PRIMARY});
        box-shadow: inset 0 0 0 3px var(--background, ${constants.BACKGROUND});
    }

    /* focus */
    &:enabled:focus::before {
        border: 1px solid var(--primary, ${constants.PRIMARY});
        box-shadow: 0 0 0 3px var(--primary, ${constants.PRIMARY_LIGHT});
        cursor: pointer;
    }

    &:enabled:checked:focus::before {
        border: 1px solid var(--primary, ${constants.PRIMARY});
        box-shadow: 0 0 0 3px var(--primary, ${constants.PRIMARY_LIGHT}),
            inset 0 0 0 3px var(--background, ${constants.BACKGROUND});
        cursor: pointer;
    }

    /* hover */
    &:enabled:hover::before {
        border: 1px solid var(--primary, ${constants.PRIMARY});
        cursor: pointer;
    }

    &:enabled:hover + span {
        color: var(--primary, ${constants.PRIMARY});
        cursor: pointer;
    }

    /* disabled */
    &:disabled::before {
        border: 1px solid var(--disabled-border, ${constants.DISABLED_BORDER});
        background-color: var(--light-grey, ${constants.LIGHT_GREY});
    }

    &:disabled:checked::before {
        border: 1px solid var(--disabled-border, ${constants.DISABLED_BORDER});
        background-color: var(--disabled-border, ${constants.DISABLED_BORDER});
        box-shadow: inset 0 0 0 3px var(--background, ${constants.BACKGROUND});
    }

    &:disabled + span {
        color: var(--disabled-border, ${constants.DISABLED_BORDER});
    }
`;

function Radio(props: PropTypes.InferProps<React.AllHTMLAttributes<HTMLInputElement> & typeof Radio.propTypes>) {
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
