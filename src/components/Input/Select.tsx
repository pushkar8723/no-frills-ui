import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import ExpandMore from '../../icons/ExpandMore';
import constants from '../../shared/constants';

interface SelectProps extends PropTypes.InferType<typeof Select.propTypes>,
    React.InputHTMLAttributes<HTMLSelectElement> {
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

    & svg {
        fill: currentColor;
    }
`;

const SelectField = styled.select<SelectInternalProps>`
    border: none;
    color: inherit;
    padding: 0 8px;
    line-height: 30px;
    min-height: 32px;
    width: 268px;
    border-radius: 3px;
    border: 1px solid var(--border-color, ${constants.BORDER_COLOR});
    display: inline-block;
    background-color: var(--background, ${constants.BACKGROUND});
    pointer-events: auto;
    appearance: none;

    /** Focused */
    &:focus, &:active {
        border-color: var(--primary, ${constants.PRIMARY});
        box-shadow: 0 0 0 4px var(--primary, ${constants.PRIMARY_LIGHT});
    }

    &:focus ~ span, &:active ~ span {
        color: var(--primary, ${constants.PRIMARY});
    }

    /** Disabled */
    &:disabled {
        border-color: var(--disabled-border, ${constants.DISABLED_BORDER});
        background-color: var(--disabled-background, ${constants.DISABLED_BACKGROUND});
    }
    
    &:disabled ~ span {
        color: var(--disabled, ${constants.DISABLED});
    }

    /** Invalid */
    &:focus:invalid {
        border-color: var(--error, ${constants.ERROR});
        box-shadow: 0 0 0 4px var(--error-light, ${constants.ERROR_LIGHT});
    }

    ${props => props.touched ? `
    &:invalid {
        border-color: var(--error, ${constants.ERROR});
    }

    &:invalid ~ span {
        color: var(--error, ${constants.ERROR});
    }
    ` : ''}

    /** Error */
    ${props => props.errorText ? `
    border-color: var(--error, ${constants.ERROR});

    & ~ span {
        color: var(--error, ${constants.ERROR});
    }
    ` : ''}

    /** Required */
    &:required + span:after {
        content: '*';
        margin-left: 2px;
        color: var(--error, ${constants.ERROR});
    }

    /** Label Animation */
    & + span {
        position: absolute;
        padding: 0 5px;
        top: 0px;
        left: 4px;
        font-size: 14px;
        line-height: 32px;
        transition: all 300ms ease;
    }

    ${props => props.value !== '' ? `
    & + span {
        top: -8px;
        background: var(--background, ${constants.BACKGROUND});
        font-size: 12px;
        line-height: 14px;
    }
    `: ''}

    &:focus + span, &:placeholder-shown + span {
        top: -8px;
        background: var(--background, ${constants.BACKGROUND});
        font-size: 12px;
        line-height: 14px;
    }
`;

const ErrorContainer = styled.div`
    color: var(--error, ${constants.ERROR});
    padding-top: 3px;
    font-size: 12px;
    line-height: 14px;
    margin-left: 3px;
`;

const ArrowContainer = styled.span`
    position: absolute;
    right: 8px;
    top: 8px;
`;

export default function Select(props: SelectProps) {
    const [touched, setTouched] = useState(false);
    const [value, setValue] = useState(props.value || '');

    const handleFocus = (e: React.FocusEvent<HTMLSelectElement>) => {
        setTouched(true);
        if (props.onFocus) {
            props.onFocus(e);
        }
    }

    const onChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (props.onChange) {
            setValue(e.target.value);
            props.onChange(e);
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
            <ArrowContainer><ExpandMore /></ArrowContainer>
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
