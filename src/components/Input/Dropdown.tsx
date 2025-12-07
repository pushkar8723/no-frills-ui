import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { ExpandMore } from '../../icons';
import { Menu } from '../Menu';
import { Popover, POPOVER_POSITION } from '../Popover';
import Input from './Input';

type DropdownProps<T> = {
    /** Value of the control */
    value?: T | T[];
    /** If multiple elements can be selected */
    multiSelect: boolean;
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
} & React.PropsWithChildren<unknown>;

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
 * @param {DropdownProps<T>} props - The properties for the Dropdown component.
 * @returns {JSX.Element} The rendered Dropdown component.
 */
export default function Dropdown<T extends object>(props: DropdownProps<T>) {
    const { multiSelect, onChange } = props;
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(props.value);
    const id = React.useId();
    const menuId = `${id}-menu`;
    const menuRef = React.useRef<HTMLDivElement>(null);
    const triggerRef = React.useRef<HTMLInputElement>(null);

    // Focus menu when opened
    useEffect(() => {
        if (open) {
            // Find the listbox and focus it
            // We use a timeout to ensure popover is rendered
            setTimeout(() => {
                menuRef.current?.focus();
            }, 0);
        } else {
            // Return focus to trigger when closed, but only if it was previously open
            // and we are not unmounting (implied by effect dependency)
            // check if focus is currently in the body or on the menu (don't steal focus if user clicked elsewhere)
            // Ideally we check document.activeElement, but simple return is usually safe for this component's behavior
            // We'll skip complex check for now as per plan focus restoration
            if (document.activeElement && menuRef.current?.contains(document.activeElement)) {
                triggerRef.current?.focus();
            }
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

    return (
        <Popover
            position={POPOVER_POSITION.BOTTOM_LEFT}
            open={open}
            element={() => (
                <>
                    <Input
                        ref={triggerRef}
                        type="text"
                        value={value && String(value)}
                        label={props.label}
                        errorText={props.errorText}
                        onClick={clickHandler}
                        onKeyDown={onKeyDown}
                        required={props.required}
                        disabled={props.disabled}
                        readOnly
                        role="combobox"
                        aria-haspopup="listbox"
                        aria-expanded={open}
                        aria-controls={menuId}
                    />
                    <ArrowContainer>
                        <ExpandMore />
                    </ArrowContainer>
                </>
            )}
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
                {props.children}
            </Menu>
        </Popover>
    );
}

Dropdown.defaultProps = {
    multiSelect: false,
};
