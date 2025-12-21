import React, { useState, useEffect, useId, useRef } from 'react';
import styled from '@emotion/styled';
import { getThemeValue, THEME_NAME } from '../../shared/constants';

type TextAreaProps = {
    /** Label for the field */
    label: string;
    /** Error text to be shown below the field */
    errorText?: string;
} & React.InputHTMLAttributes<HTMLTextAreaElement>;

type TextAreaInternalProps = {
    touched: boolean;
    errorText?: string;
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
    border: 1px solid ${getThemeValue(THEME_NAME.BORDER_COLOR)};
    display: inline-block;
    background-color: ${getThemeValue(THEME_NAME.BACKGROUND)};

    /** Focused */
    &:focus,
    &:active {
        border-color: ${getThemeValue(THEME_NAME.PRIMARY)};
        box-shadow: 0 0 0 4px ${getThemeValue(THEME_NAME.PRIMARY_LIGHT)};
    }

    &:focus + span,
    &:active + span {
        color: ${getThemeValue(THEME_NAME.PRIMARY)};
    }

    /** Disabled */
    &:disabled {
        border-color: ${getThemeValue(THEME_NAME.DISABLED_BORDER)};
        background-color: ${getThemeValue(THEME_NAME.DISABLED_BACKGROUND)};
    }

    &:disabled + span {
        color: ${getThemeValue(THEME_NAME.DISABLED)};
    }

    /** Invalid */
    &:focus:invalid {
        border-color: ${getThemeValue(THEME_NAME.ERROR)};
        box-shadow: 0 0 0 4px ${getThemeValue(THEME_NAME.ERROR_LIGHT)};
    }

    ${(props) =>
        props.touched
            ? `
    &:invalid {
        border-color: ${getThemeValue(THEME_NAME.ERROR)};
    }

    &:invalid + span {
        color: ${getThemeValue(THEME_NAME.ERROR)};
    }
    `
            : ''}

    /** Error */
    ${(props) =>
        props.errorText
            ? `
    border-color: ${getThemeValue(THEME_NAME.ERROR)};

    & + span {
        color: ${getThemeValue(THEME_NAME.ERROR)};
    }
    `
            : ''}

    /** Required */
    &:required + span:after {
        content: '*';
        margin-left: 2px;
        color: ${getThemeValue(THEME_NAME.ERROR)};
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
        background: ${getThemeValue(THEME_NAME.BACKGROUND)};
        font-size: 12px;
        line-height: 14px;
    }
    `
            : ''}

    &:focus + span, &:placeholder-shown + span {
        top: -8px;
        background: ${getThemeValue(THEME_NAME.BACKGROUND)};
        font-size: 12px;
        line-height: 14px;
    }
`;

const ErrorContainer = styled.div`
    color: ${getThemeValue(THEME_NAME.ERROR)};
    padding-top: 3px;
    font-size: 12px;
    line-height: 14px;
    margin-left: 3px;
`;

/**
 * TextArea Component
 * @param props - Component props
 * @param ref - Ref forwarded to the underlying HTMLTextAreaElement
 */
function TextAreaComponent(props: TextAreaProps, ref: React.Ref<HTMLTextAreaElement>) {
    const { label, errorText, value: propsValue, required, ...rest } = props;
    const [touched, setTouched] = useState(false);
    const [value, setValue] = useState(propsValue || '');
    const errorId = useId();
    const prevValueRef = useRef<string>();

    useEffect(() => {
        if (propsValue !== undefined && propsValue !== prevValueRef.current) {
            setValue(propsValue);
            prevValueRef.current = propsValue as string;
        }
    }, [propsValue]);

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
                {...rest}
                ref={ref}
                value={value}
                onChange={onChangeHandler}
                onFocus={handleFocus}
                touched={touched}
                required={required}
                aria-invalid={!!errorText}
                aria-required={required}
                aria-describedby={errorText ? errorId : undefined}
            />
            <span>{label}</span>
            {errorText && <ErrorContainer id={errorId}>{errorText}</ErrorContainer>}
        </Label>
    );
}

const TextArea = React.forwardRef(TextAreaComponent);
export default TextArea;
