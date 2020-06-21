import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

type SelectProps = PropTypes.InferType<typeof Select.propTypes> &
    React.HTMLAttributes<HTMLInputElement> & {
        value?: string;
    }

type SelectInternalProps = SelectProps & {
    touched: boolean;
}

const Label = styled.label`
    display: inline-flex;
    flex-direction: column;
    flex: 1;
    position: relative;
    margin: 10px 5px;
    pointer-events: none;
`;

const SelectField = styled.select<SelectInternalProps>`
    border: none;
    padding: 0 4px;
    line-height: 30px;
    height: 32px;
    width: 250px;
    border-radius: 3px;
    border: 1px solid var(--border-color, #555);
    display: inline-block;
    background-color: var(--background, #fff);
    pointer-events: auto;

    /** Focused */
    &:focus, &:active {
        border-color: var(--primary, #2283d2);
        box-shadow: 0 0 0 4px var(--primary-light, #64baff);
    }

    &:focus + span, &:active + span {
        color: var(--primary, #2283d2);
    }

    /** Disabled */
    &:disabled {
        border-color: #aaa;
        background-color: #fafafa;
    }
    
    &:disabled + span {
        color: #777;
    }

    /** Invalid */
    &:focus:invalid {
        border-color: var(--error, #d63b3b);
        box-shadow: 0 0 0 4px var(--error-light, #f1a5a5);
    }

    ${props => props.touched ? `
    &:invalid {
        border-color: var(--error, #d63b3b);
    }

    &:invalid + span {
        color: var(--error, #d63b3b);
    }
    ` : ''}

    /** Error */
    ${props => props.errorText ? `
    border-color: var(--error, #d63b3b);

    & + span {
        color: var(--error, #d63b3b);
    }
    ` : ''}

    /** Required */
    &:required + span:after {
        content: '*';
        margin-left: 2px;
        color: var(--error, #d63b3b);
    }

    /** Label Animation */
    & + span {
        position: absolute;
        padding: 0 5px;
        top: 7px;
        left: 4px;
        transition: all 300ms ease;
    }

    ${props => props.value !== '' ? `
    & + span {
        top: -8px;
        background: var(--background, #ffffff);
        font-size: 12px;
    }
    `: ''}

    &:focus + span, &:placeholder-shown + span {
        top: -8px;
        background: var(--background, #ffffff);
        font-size: 12px;
    }
`;

const ErrorContainer = styled.div`
    color: var(--error, #d63b3b);
    padding-top: 3px;
    font-size: 12px;
`;

export default function Select(props: SelectProps) {
    const [touched, setTouched] = useState(false);
    const [value, setValue] = useState(props.value || '');

    const handleFocus = () => {
        setTouched(true);
        if (props.onFocus) {
            props.onFocus.apply(null, arguments);
        }
    }

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (props.onChange) {
            props.onChange.apply(null, arguments);
        } else {
            setValue(e.target.value);
        }
    }

    return (
        <Label>
            <SelectField
                {...props}
                multiple={false}
                value={value}
                onChange={onChangeHandler}
                onFocus={handleFocus}
                touched={touched}
            >
                <option />
                {props.children}
            </SelectField>
            <span>{props.label}</span>
            { props.errorText && <ErrorContainer>{props.errorText}</ErrorContainer> }
        </Label>
    );
}

Select.propTypes = {
    /** Label for the field */
    label: PropTypes.string,
    /** Error text to be shown below the field */
    errorText: PropTypes.string,
};
