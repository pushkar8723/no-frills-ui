import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { ExpandMore } from '../../icons';
import { Menu } from '../Menu';
import { Popover, POPOVER_POSITION } from '../Popover';
import Input from './Input';

type DropdownProps<T> = React.PropsWithChildren<{
    /** Value of the control */
    value?: T | T[];
    /**
     * If multiple elements can be selected
     * @default false
     */
    multiSelect?: boolean;
    /** Change handler */
    onChange?: (v: T | T[]) => void;
    /** Label of the control */
    label?: string;
    /** Error message */
    errorText?: string;
    /** Makes field required */
    required?: boolean;
    /** Disables the field */
    disabled?: boolean;
}> &
    React.InputHTMLAttributes<HTMLInputElement>;

const ArrowContainer = styled.span`
    position: absolute;
    right: 12px;
    top: 16px;
    pointer-events: none;
`;

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        ...rest
    } = props;
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState<T | T[] | undefined>(propValue);
    const id = React.useId();
    const menuId = `${id}-menu`;
    const menuRef = React.useRef<HTMLDivElement | null>(null);
    const triggerRef = React.useRef<HTMLInputElement | null>(
        null,
    ) as React.MutableRefObject<HTMLInputElement | null>;

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
            }, 100); // Wait after Popover has set initial focus
            return () => clearTimeout(timer);
        }
    }, [open]);

    /**
     * Handles keydown events on the input trigger.
     * Opens the menu on 'Enter', 'Space', 'ArrowDown', or 'ArrowUp'.
     *
     * @param {React.KeyboardEvent<HTMLInputElement>} e - The keyboard event.
     */
    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
            e.preventDefault();
            setOpen(true);
        }
    };

    /**
     * Handles changes to the dropdown value.
     * Updates local state and calls the external onChange handler.
     * Closes the dropdown if not in multi-select mode.
     *
     * @param {T | T[]} val - The new value(s).
     */
    const changeHandler = (val: T | T[]) => {
        setValue(val);
        onChange?.(val);

        // Close dropdown after selection if not multiSelect
        if (!multiSelect) {
            setOpen(false);
            triggerRef.current?.focus();
        }
    };

    /**
     * Toggles the dropdown open state on click.
     */
    const clickHandler = () => setOpen(true);

    const TriggerElement = React.forwardRef<HTMLInputElement>((passedProps, ref) => {
        // Helper to assign both internal triggerRef and external forwarded ref
        const assignRefs = (node: HTMLInputElement | null) => {
            triggerRef.current = node;

            if (!outerRef) return;
            if (typeof outerRef === 'function') {
                try {
                    outerRef(node);
                } catch (e) {
                    console.warn(e);
                }
            } else {
                try {
                    (outerRef as React.MutableRefObject<HTMLInputElement | null>).current = node;
                } catch (e) {
                    console.warn(e);
                }
            }
        };

        // Combine the ref passed by parent with our assignRefs so both are updated
        const combinedRef: React.Ref<HTMLInputElement> = (node) => {
            assignRefs(node);
            if (typeof ref === 'function') {
                try {
                    ref(node);
                } catch (e) {
                    console.warn(e);
                }
            } else if (ref) {
                try {
                    (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
                } catch (e) {
                    console.warn(e);
                }
            }
        };

        return (
            <>
                <Input
                    {...rest}
                    {...passedProps}
                    ref={combinedRef}
                    type="text"
                    value={value && String(value)}
                    label={label}
                    errorText={errorText}
                    onClick={clickHandler}
                    onKeyDown={onKeyDown}
                    required={required}
                    disabled={disabled}
                    readOnly
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
    TriggerElement.displayName = 'DropdownTrigger';

    return (
        <Popover
            position={POPOVER_POSITION.BOTTOM_LEFT}
            open={open}
            element={TriggerElement}
            onClose={() => {
                setOpen(false);
                triggerRef.current?.focus();
            }}
        >
            <Menu<T>
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

const Dropdown = React.forwardRef(DropdownComponent);
export default Dropdown;
