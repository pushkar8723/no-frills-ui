import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Input = styled.input`
    appearance: none;

    &::before {
        content: ' ';
        width: 16px;
        height: 16px;
        border: 1px solid #000;
        display: inline-block;
        border-radius: 3px;
        vertical-align: bottom;
        margin-right: 5px;
        text-align: center;
        line-height: 16px;
        background-color: var(--background, #fff);
    }

    /** checked */
    &:checked::before {
        content: '✔';
        background-color: var(--primary, #2283d2);
        border-color: var(--primary, #2283d2);
        color: #fff;
    }

    /** indeterminate */
    &:indeterminate::before {
        content: '-';
        background-color: var(--primary, #2283d2);
        border-color: var(--primary, #2283d2);
        color: #fff;
    }

    /** active and focus */
    &:enabled:active::before, &:focus::before {
        border-color: var(--primary, #2283d2);
        box-shadow: 0 0 0 3px var(--primary-light, #64baff); 
    }

    &:enabled:active + span, &:focus + span {
        color: var(--primary, #2283d2);
    }

    /** hover */
    &:enabled:hover::before {
        border-color: var(--primary, #2283d2);
        box-shadow: 0 0 0 3px var(--primary-light, #64baff); 
    }

    &:enabled:hover + span {
        color: var(--primary, #2283d2);
    }

    /** disabled */
    &:disabled::before {
        border-color: #aaa;
    }

    &:disabled + span {
        color: #aaa;
    }

    &:checked:disabled::before, &:indeterminate:disabled::before {
        background-color: #aaa;
    }
`;

type CheckboxProps = {
        ref: React.MutableRefObject<HTMLInputElement>
    } & PropTypes.InferProps<typeof Checkbox.propTypes>;

export default function Checkbox(props: CheckboxProps) {
    const ref = useCallback((node) => {
        if (node !== null) {
            if (props.indeterminate) {
                node.indeterminate = true;
            }
            if (props.ref) {
                props.ref.current = node;
            }
        }
    }, []);

    return (
        <label>
            <Input {...props} ref={ref} type="checkbox" />
            <span>{props.label}</span>
        </label>
    );
}

Checkbox.propTypes = {
    /** Label for the field */
    label: PropTypes.string,
    /** If the field is in indeterminate state */
    indeterminate: PropTypes.bool,
}

Checkbox.defaultProps = {
    indeterminate: false,
}
