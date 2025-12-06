import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import constants from '../../shared/constants';

interface TextAreaProps
    extends
        PropTypes.InferType<typeof TextArea.propTypes>,
        React.InputHTMLAttributes<HTMLTextAreaElement> {
    value?: string;
}

type TextAreaInternalProps = TextAreaProps & {
    touched: boolean;
};

const Label = styled.label`
    display: inline-flex;
    flex-direction: column;
    position: relative;
    margin: 10px 5px;
`;

const TextField = styled.textarea<TextAreaInternalProps>`
    border: none;
    color: inherit;
    padding: 8px;
    min-height: 150px;
    min-width: 250px;
    border-radius: 3px;
    border: 1px solid var(--border-color, ${constants.BORDER_COLOR});
    display: inline-block;
    background-color: var(--background, ${constants.BACKGROUND});

    /** Focused */
    &:focus,
    &:active {
        border-color: var(--primary, ${constants.PRIMARY});
        box-shadow: 0 0 0 4px var(--primary, ${constants.PRIMARY_LIGHT});
    }

    &:focus + span,
    &:active + span {
        color: var(--primary, ${constants.PRIMARY});
    }

    /** Disabled */
    &:disabled {
        border-color: var(--disabled-border, ${constants.DISABLED_BORDER});
        background-color: var(--disabled-background, ${constants.DISABLED_BACKGROUND});
    }

    &:disabled + span {
        color: var(--disabled, ${constants.DISABLED});
    }

    /** Invalid */
    &:focus:invalid {
        border-color: var(--error, ${constants.ERROR});
        box-shadow: 0 0 0 4px var(--error-light, ${constants.ERROR_LIGHT});
    }

    ${(props) =>
        props.touched
            ? `
    &:invalid {
        border-color: var(--error, ${constants.ERROR});
    }

    &:invalid + span {
        color: var(--error, ${constants.ERROR});
    }
    `
            : ''}

    /** Error */
    ${(props) =>
        props.errorText
            ? `
    border-color: var(--error, ${constants.ERROR});

    & + span {
        color: var(--error, ${constants.ERROR});
    }
    `
            : ''}

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

    ${(props) =>
        props.value !== ''
            ? `
    & + span {
        top: -8px;
        background: var(--background, ${constants.BACKGROUND});
        font-size: 12px;
        line-height: 14px;
    }
    `
            : ''}

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

export default function TextArea(props: TextAreaProps) {
    const [touched, setTouched] = useState(false);
    const [value, setValue] = useState(props.value || '');

    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
        setTouched(true);
        if (props.onFocus) {
            props.onFocus(e);
        }
    };

    const onChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (props.onChange) {
            setValue(e.target.value);
            props.onChange(e);
        } else {
            setValue(e.target.value);
        }
    };

    return (
        <Label>
            <TextField
                {...props}
                value={value}
                onChange={onChangeHandler}
                onFocus={handleFocus}
                touched={touched}
            />
            <span>{props.label}</span>
            {props.errorText && <ErrorContainer>{props.errorText}</ErrorContainer>}
        </Label>
    );
}

TextArea.propTypes = {
    /** Label for the field */
    label: PropTypes.string,
    /** Error text to be shown below the field */
    errorText: PropTypes.string,
};
