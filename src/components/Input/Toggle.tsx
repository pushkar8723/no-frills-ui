import React, { useEffect, useId, useRef, useImperativeHandle } from 'react';
import styled from '@emotion/styled';
import { getThemeValue, THEME_NAME } from '../../shared/constants';

const Switch = styled.label`
    position: relative;
    display: inline-flex;
    margin: 5px 0;
`;

const Input = styled.input`
    position: absolute;
    width: 0;
    height: 0;
    appearance: none;
    margin: 0;

    & + span {
        position: relative;
        cursor: pointer;
        width: 30px;
        height: 18px;
        background-color: ${getThemeValue(THEME_NAME.LIGHT_GREY)};
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
        border: 1px solid ${getThemeValue(THEME_NAME.DISABLED_BORDER)};
        border-radius: 50%;
        background-color: ${getThemeValue(THEME_NAME.BACKGROUND)};
        transition: 0.4s;
    }

    /* checked */
    &:checked + span {
        background-color: ${getThemeValue(THEME_NAME.PRIMARY_LIGHT)};
    }

    &:checked + span:before {
        transform: translateX(18px);
        border-color: ${getThemeValue(THEME_NAME.PRIMARY)};
    }

    /* focus */
    &:enabled:focus + span:before {
        box-shadow: 0 0 0 3px ${getThemeValue(THEME_NAME.PRIMARY_LIGHT)};
        border-color: ${getThemeValue(THEME_NAME.PRIMARY)};
    }

    /* hover */
    &:enabled:hover ~ span {
        cursor: pointer;
        color: ${getThemeValue(THEME_NAME.PRIMARY)};
    }

    /* disabled */
    &:disabled ~ span {
        color: ${getThemeValue(THEME_NAME.DISABLED_BORDER)};
    }

    &:disabled + span {
        background-color: ${getThemeValue(THEME_NAME.LIGHT_GREY)};
        cursor: not-allowed;
    }

    &:disabled + span:before {
        background-color: ${getThemeValue(THEME_NAME.BORDER_LIGHT_COLOR)};
        border-color: ${getThemeValue(THEME_NAME.DISABLED_BORDER)};
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

type ToggleProps = {
    /** Label for the field */
    label?: string;
    /** Error text to be shown below the field */
    errorText?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

/**
 * Toggle Component
 * @param props - Component props
 * @param forwardedRef - Ref forwarded to the underlying HTMLInputElement
 */
function ToggleComponent(props: ToggleProps, forwardedRef: React.Ref<HTMLInputElement>) {
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
            <Switch>
                <Input
                    {...rest}
                    ref={internalRef}
                    type="checkbox"
                    role="switch"
                    aria-checked={props.checked}
                    aria-invalid={!!errorText}
                    aria-label={label}
                    aria-describedby={errorText ? errorId : undefined}
                />
                <span></span>
                <span>{label}</span>
            </Switch>
            {errorText && <ErrorContainer id={errorId}>{errorText}</ErrorContainer>}
        </Container>
    );
}

const Toggle = React.forwardRef(ToggleComponent);
export default Toggle;
