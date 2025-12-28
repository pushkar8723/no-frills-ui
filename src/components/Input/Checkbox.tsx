import React, { useCallback, useEffect, useId, useRef, useImperativeHandle } from 'react';
import styled from '@emotion/styled';
import { getThemeValue, THEME_NAME } from '../../shared/constants';

const Label = styled.label`
    margin: 5px 0;
    position: relative;
    display: inline-flex;
    align-items: center;
    cursor: pointer;
`;

const StyledCheckmark = styled.span`
    width: 16px;
    height: 16px;
    border: 1px solid ${getThemeValue(THEME_NAME.BORDER_COLOR)};
    display: inline-block;
    border-radius: 3px;
    margin-right: 5px;
    background-color: ${getThemeValue(THEME_NAME.BACKGROUND)};
    transition: all 0.3s ease;
    position: relative;
    flex-shrink: 0;

    &::after {
        content: '';
        width: 3px;
        height: 10px;
        border-right: 2px solid ${getThemeValue(THEME_NAME.TEXT_COLOR_LIGHT)};
        border-bottom: 2px solid ${getThemeValue(THEME_NAME.TEXT_COLOR_LIGHT)};
        position: absolute;
        top: 1px;
        left: 6px;
        opacity: 0;
        transform: rotate(45deg) scale(0);
        transition: all 0.2s ease;
    }
`;

const HiddenInput = styled.input`
    opacity: 0;
    width: 0;
    height: 0;
    position: absolute;
    margin: 0;

    /** checked */
    &:checked + ${StyledCheckmark} {
        background-color: ${getThemeValue(THEME_NAME.PRIMARY)};
        border-color: ${getThemeValue(THEME_NAME.PRIMARY)};
    }

    &:checked + ${StyledCheckmark}::after {
        opacity: 1;
        transform: rotate(45deg) scale(1);
    }

    /** indeterminate */
    &:indeterminate + ${StyledCheckmark} {
        background-color: ${getThemeValue(THEME_NAME.PRIMARY)};
        border-color: ${getThemeValue(THEME_NAME.PRIMARY)};
    }

    &:indeterminate + ${StyledCheckmark}::after {
        opacity: 1;
        height: 0;
        width: 8px;
        border-right: none;
        border-bottom: 2px solid ${getThemeValue(THEME_NAME.TEXT_COLOR_LIGHT)};
        transform: rotate(0deg) scale(1);
        top: 7px;
        left: 4px;
    }

    /** active and focus */
    &:enabled:active + ${StyledCheckmark}, &:focus + ${StyledCheckmark} {
        border-color: ${getThemeValue(THEME_NAME.PRIMARY)};
        box-shadow: 0 0 0 3px ${getThemeValue(THEME_NAME.PRIMARY_LIGHT)};
    }

    &:enabled:active ~ span,
    &:focus ~ span {
        color: ${getThemeValue(THEME_NAME.PRIMARY)};
    }

    /** hover */
    &:enabled:hover + ${StyledCheckmark} {
        border-color: ${getThemeValue(THEME_NAME.PRIMARY)};
    }

    &:enabled:hover ~ span {
        color: ${getThemeValue(THEME_NAME.PRIMARY)};
    }

    /** disabled */
    &:disabled + ${StyledCheckmark} {
        border-color: ${getThemeValue(THEME_NAME.DISABLED_BORDER)};
        cursor: not-allowed;
    }

    &:disabled ~ span {
        color: ${getThemeValue(THEME_NAME.DISABLED)};
        cursor: not-allowed;
    }

    &:checked:disabled + ${StyledCheckmark}, &:indeterminate:disabled + ${StyledCheckmark} {
        background-color: ${getThemeValue(THEME_NAME.DISABLED)};
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

type CheckboxProps = {
    /**
     * Label for the field
     * @default ''
     */
    label?: string;
    /**
     * If the field is in indeterminate state
     * @default false
     */
    indeterminate?: boolean;
    /** Error text to be shown below the field */
    errorText?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

/**
 * Checkbox Component
 * @param props - Component props
 * @param fwdRef - Ref forwarded to the underlying HTMLInputElement
 */
function CheckboxComponent(props: CheckboxProps, fwdRef: React.Ref<HTMLInputElement>) {
    const { label = '', indeterminate = false, checked, errorText, ...rest } = props;
    const internalRef = useRef<HTMLInputElement | null>(null);
    const errorId = useId();

    useImperativeHandle(fwdRef, () => internalRef.current as HTMLInputElement);

    useEffect(() => {
        if (internalRef.current) {
            internalRef.current.setCustomValidity(errorText || '');
        }
    }, [errorText]);

    const ref = useCallback(
        (node: HTMLInputElement | null) => {
            internalRef.current = node;
            // Ensure the DOM `indeterminate` flag always matches the prop
            if (node) {
                node.indeterminate = !!indeterminate;
            }

            // Forward the node (or null) to the parent ref (supports function or ref object)
            // Note: Since we use useImperativeHandle now, we don't technically need to manually forward here
            // if we weren't doing the ref callback pattern for indeterminate.
            // However, useImperativeHandle handles the forwarding.
            // BUT, our local ref callback `ref` is passed to the input `ref={ref}`.
            // React will call this callback with the node.
            // Inside this callback, we set internalRef.current.
            // useImperativeHandle exposes internalRef.current to fwdRef.
            // So we don't need manual forwarding logic here anymore!
        },
        [indeterminate],
    );

    return (
        <Container>
            <Label>
                <HiddenInput
                    {...rest}
                    ref={ref}
                    type="checkbox"
                    checked={checked}
                    aria-checked={indeterminate ? 'mixed' : checked}
                    aria-invalid={!!errorText}
                    aria-describedby={errorText ? errorId : undefined}
                />
                <StyledCheckmark />
                <span>{label}</span>
            </Label>
            {errorText && <ErrorContainer id={errorId}>{errorText}</ErrorContainer>}
        </Container>
    );
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(CheckboxComponent);

export default Checkbox;
