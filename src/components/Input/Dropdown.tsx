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
    const [value, setValue] = useState<T | T[] | undefined>(props.value);
    const id = React.useId();
    const menuId = `${id}-menu`;
    const menuRef = React.useRef<HTMLDivElement>(null);
    const triggerRef = React.useRef<HTMLInputElement>(null);

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

    const TriggerElement = React.forwardRef<HTMLInputElement>((passedProps, ref) => (
        <>
            <Input
                {...passedProps}
                ref={ref}
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
            <ArrowContainer aria-hidden="true">
                <ExpandMore />
            </ArrowContainer>
        </>
    ));
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
