import React, { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { ExpandMore } from '../../icons';
import { Menu } from '../Menu';
import { MenuItemProps } from '../Menu/MenuItem';
import { Popover, POPOVER_POSITION } from '../Popover';
import Input from './Input';

type DropdownCommonProps = {
    /** Label of the control */
    label?: string;
    /** Error message */
    errorText?: string;
    /** Makes field required */
    required?: boolean;
    /** Disables the field */
    disabled?: boolean;
    /** Callback called when dropdown is opened */
    onOpen?: () => void;
    /** Callback called when dropdown is closed */
    onClose?: () => void;
};

type DropdownMultiSelectProps<T> = {
    /** Value of the control */
    value?: T[];
    /**
     * If multiple elements can be selected
     */
    multiSelect?: true;
    /** Change handler */
    onChange?: (v: T[]) => void;
    /** Function to provide custom display value */
    displayNameProvider?: (value?: T[]) => string;
};

type DropdownSingleSelectProps<T> = {
    /** Value of the control */
    value?: T;
    /**
     * If multiple elements can be selected
     * @default false
     */
    multiSelect?: false;
    /** Change handler */
    onChange?: (v: T) => void;
    /** Function to provide custom display value */
    displayNameProvider?: (value?: T) => string;
};

export type DropdownProps<T> = React.PropsWithChildren<
    (DropdownSingleSelectProps<T> | DropdownMultiSelectProps<T>) & DropdownCommonProps
> &
    Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>;

const ArrowContainer = styled.span`
    position: absolute;
    right: 12px;
    top: 16px;
    pointer-events: none;
`;

/**
 * DropdownTrigger Component
 */
const DropdownTrigger = React.forwardRef<
    HTMLInputElement,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value'> & {
        displayValue: string;
        label?: string;
        errorText?: string;
        open: boolean;
        menuId: string;
        toggleOpen: () => void;
        onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
        forwardedRef?: React.Ref<HTMLInputElement>;
    }
>((props, ref) => {
    const {
        displayValue,
        label,
        errorText,
        open,
        menuId,
        toggleOpen,
        onKeyDown,
        forwardedRef,
        ...rest
    } = props;
    const triggerRef = React.useRef<HTMLInputElement | null>(null);

    // Helper to assign both internal triggerRef and external forwarded ref
    const assignRefs = React.useCallback(
        (node: HTMLInputElement | null) => {
            triggerRef.current = node;

            if (!forwardedRef) return;
            if (typeof forwardedRef === 'function') {
                forwardedRef(node);
            } else {
                (forwardedRef as React.MutableRefObject<HTMLInputElement | null>).current = node;
            }
        },
        [forwardedRef],
    );

    // Combine the ref passed by parent with our assignRefs so both are updated
    const combinedRef = React.useCallback(
        (node: HTMLInputElement | null) => {
            assignRefs(node);
            if (typeof ref === 'function') {
                ref(node);
            } else if (ref) {
                (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
            }
        },
        [assignRefs, ref],
    );

    return (
        <>
            <Input
                {...rest}
                ref={combinedRef}
                type="text"
                value={displayValue}
                label={label}
                errorText={errorText}
                onClick={toggleOpen}
                onKeyDown={onKeyDown}
                inputMode="none"
                role="combobox"
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-controls={menuId}
            />
            <ArrowContainer aria-hidden="true">
                <ExpandMore />
            </ArrowContainer>
        </>
    );
});
DropdownTrigger.displayName = 'DropdownTrigger';

/**
 * Dropdown component that allows selection from a list of options.
 * Supports single and multi-select modes.
 *
 * @template T - The type of the value(s) in the dropdown.
 * @param props - The properties for the Dropdown component.
 * @returns The rendered Dropdown component.
 */
function DropdownComponent<T extends object>(
    props: DropdownProps<T>,
    outerRef: React.Ref<HTMLInputElement>,
) {
    const {
        multiSelect = false,
        onChange,
        children,
        value: propValue,
        label,
        errorText,
        required,
        disabled,
        onOpen,
        onClose,
        displayNameProvider,
        ...rest
    } = props;
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(propValue);
    const id = React.useId();
    const menuId = `${id}-menu`;
    const menuRef = React.useRef<HTMLDivElement | null>(null);
    const triggerRef = React.useRef<HTMLInputElement | null>(null);

    /**
     * Gets the display value for the dropdown based on the current value and children.
     *
     * @param currentValue - The current value of the dropdown.
     * @param currentChildren - The children of the dropdown.
     * @returns The display value.
     */
    const getDisplayValue = (
        currentValue: T | T[] | undefined,
        currentChildren: React.ReactNode,
    ): string => {
        if (currentValue === undefined || currentValue === null) return '';

        const findLabel = (val: T): string => {
            let label = '';
            React.Children.forEach(currentChildren, (child) => {
                if (React.isValidElement(child)) {
                    const props = child.props as MenuItemProps<T> & React.PropsWithChildren;
                    if ('value' in props && props.value === val) {
                        label = String(props.children);
                    }
                }
            });
            return label;
        };

        if (Array.isArray(currentValue)) {
            return currentValue.map(findLabel).filter(Boolean).join(', ');
        }

        return findLabel(currentValue as T);
    };

    const displayValue =
        (multiSelect
            ? (displayNameProvider as (value?: T[]) => string)?.(value as T[])
            : (displayNameProvider as (value?: T) => string)?.(value as T)) ||
        getDisplayValue(value, children) ||
        (value !== null && value !== undefined ? String(value) : '');

    // Sync prop value with state
    const prevValueRef = useRef<T | T[] | undefined>(undefined);
    useEffect(() => {
        if (propValue !== prevValueRef.current) {
            setValue(propValue);
            prevValueRef.current = propValue;
        }
    }, [propValue]);

    // Focus menu when opened
    useEffect(() => {
        if (open) {
            // Wait for Popover to fully open and focus itself first
            // Then move focus to the first menu item
            const timer = setTimeout(() => {
                const firstItem = menuRef.current?.querySelector('[role="option"]') as HTMLElement;
                if (firstItem) {
                    firstItem.focus();
                }
                onOpen?.();
            }, 100); // Wait after Popover has set initial focus
            return () => clearTimeout(timer);
        } else {
            onClose?.();
        }
    }, [open, onOpen, onClose]);

    /**
     * Handles keydown events on the input trigger.
     * Opens the menu on 'Enter', 'Space', 'ArrowDown', or 'ArrowUp'.
     *
     * @param {React.KeyboardEvent<HTMLInputElement>} e - The keyboard event.
     */
    const onKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
            e.preventDefault();
            setOpen(true);
        } else if (e.key !== 'Tab') {
            // Prevent typing to mimic readOnly behavior while allowing native validation
            e.preventDefault();
        }
    }, []);

    /**
     * Handles changes to the dropdown value.
     * Updates local state and calls the external onChange handler.
     * Closes the dropdown if not in multi-select mode.
     *
     * @param {T | T[]} val - The new value(s).
     */
    const changeHandler = (val: T | T[]) => {
        setValue(val);
        if (multiSelect) {
            (onChange as (v: T[]) => void)?.(val as T[]);
        } else {
            (onChange as (v: T) => void)?.(val as T);
        }

        // Close dropdown after selection if not multiSelect
        if (!multiSelect) {
            setOpen(false);
            triggerRef.current?.focus();
        }
    };

    /**
     * Toggles the dropdown open state on click.
     */
    const clickHandler = React.useCallback(() => setOpen(true), []);

    /**
     * Forwarded ref handler for the trigger input.
     */
    const handleForwardedRef = React.useCallback(
        (node: HTMLInputElement | null) => {
            triggerRef.current = node;
            if (typeof outerRef === 'function') {
                outerRef(node);
            } else if (outerRef) {
                (outerRef as React.MutableRefObject<HTMLInputElement | null>).current = node;
            }
        },
        [outerRef],
    );

    return (
        <Popover
            position={POPOVER_POSITION.BOTTOM_LEFT}
            open={open}
            element={
                <DropdownTrigger
                    {...rest}
                    displayValue={displayValue}
                    label={label}
                    errorText={errorText}
                    open={open}
                    menuId={menuId}
                    toggleOpen={clickHandler}
                    onKeyDown={onKeyDown}
                    required={required}
                    disabled={disabled}
                    forwardedRef={handleForwardedRef}
                />
            }
            onClose={() => {
                setOpen(false);
                triggerRef.current?.focus();
            }}
        >
            <Menu
                ref={menuRef}
                id={menuId}
                value={value}
                multiSelect={multiSelect}
                onChange={changeHandler}
            >
                {children}
            </Menu>
        </Popover>
    );
}

const Dropdown = React.forwardRef(DropdownComponent) as <T>(
    props: DropdownProps<T> & React.RefAttributes<HTMLInputElement>,
) => React.ReactElement | null;
export default Dropdown;
