import React, { useEffect, useId, useRef, useImperativeHandle } from 'react';
import styled from '@emotion/styled';
import { getThemeValue, THEME_NAME } from '../../shared/constants';

const Label = styled.label`
    display: inline-flex;
    align-items: center;
    margin: 5px 10px 5px 0;
    cursor: pointer;
    position: relative;
`;

const StyledRadio = styled.span`
    width: 16px;
    height: 16px;
    margin-right: 5px;
    border: 1px solid ${getThemeValue(THEME_NAME.BORDER_COLOR)};
    border-radius: 50%;
    display: block;
    transition: background-color 0.3s ease;
    position: relative;
    flex-shrink: 0;

    &::after {
        content: '';
        width: 100%;
        height: 100%;
        border-radius: 50%;
        position: absolute;
        top: 0;
        left: 0;
        box-shadow: inset 0 0 0 3px ${getThemeValue(THEME_NAME.BACKGROUND)};
        opacity: 0;
        transition: opacity 0.2s ease;
    }
`;

const HiddenInput = styled.input`
    opacity: 0;
    width: 0;
    height: 0;
    position: absolute;
    margin: 0;

    /* checked */
    &:checked + ${StyledRadio} {
        border-color: ${getThemeValue(THEME_NAME.PRIMARY)};
        background-color: ${getThemeValue(THEME_NAME.PRIMARY)};
    }

    &:checked + ${StyledRadio}::after {
        opacity: 1;
    }

    /* focus */
    &:enabled:focus + ${StyledRadio} {
        border-color: ${getThemeValue(THEME_NAME.PRIMARY)};
        box-shadow: 0 0 0 3px ${getThemeValue(THEME_NAME.PRIMARY_LIGHT)};
    }

    &:enabled:checked:focus + ${StyledRadio} {
        border-color: ${getThemeValue(THEME_NAME.PRIMARY)};
        box-shadow: 0 0 0 3px ${getThemeValue(THEME_NAME.PRIMARY_LIGHT)};
    }

    /* hover */
    &:enabled:hover + ${StyledRadio} {
        border-color: ${getThemeValue(THEME_NAME.PRIMARY)};
    }

    &:enabled:hover ~ span {
        color: ${getThemeValue(THEME_NAME.PRIMARY)};
    }

    /* disabled */
    &:disabled + ${StyledRadio} {
        border-color: ${getThemeValue(THEME_NAME.DISABLED_BORDER)};
        background-color: ${getThemeValue(THEME_NAME.LIGHT_GREY)};
        cursor: not-allowed;
    }

    &:disabled:checked + ${StyledRadio} {
        border-color: ${getThemeValue(THEME_NAME.DISABLED_BORDER)};
        background-color: ${getThemeValue(THEME_NAME.DISABLED_BORDER)};
    }

    &:disabled ~ span {
        color: ${getThemeValue(THEME_NAME.DISABLED_BORDER)};
        cursor: not-allowed;
    }
`;

const ErrorContainer = styled.div`
    color: ${getThemeValue(THEME_NAME.ERROR)};
    padding-top: 3px;
    font-size: 12px;
    line-height: 14px;
`;

const Container = styled.div`
    display: inline-flex;
    flex-direction: column;
`;

type RadioProps = {
    /** Label for the field */
    label?: string;
    /** Error text to be shown below the field */
    errorText?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

/**
 * Radio Component
 * @param props - Component props
 * @param forwardedRef - Ref forwarded to the underlying HTMLInputElement
 */
function RadioComponent(props: RadioProps, forwardedRef: React.Ref<HTMLInputElement>) {
    const { label, errorText, ...rest } = props;
    const internalRef = useRef<HTMLInputElement>(null);
    const errorId = useId();

    useImperativeHandle(forwardedRef, () => internalRef.current as HTMLInputElement);

    useEffect(() => {
        if (internalRef.current) {
            internalRef.current.setCustomValidity(errorText || '');
        }
    }, [errorText]);

    return (
        <Container>
            <Label>
                <HiddenInput
                    {...rest}
                    ref={internalRef}
                    type="radio"
                    aria-invalid={!!errorText}
                    aria-describedby={errorText ? errorId : undefined}
                />
                <StyledRadio />
                <span>{label}</span>
            </Label>
            {errorText && <ErrorContainer id={errorId}>{errorText}</ErrorContainer>}
        </Container>
    );
}

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(RadioComponent);
export default Radio;
