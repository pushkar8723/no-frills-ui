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

export default function Dropdown<T extends object>(props: DropdownProps<T>) {
    const { multiSelect, onChange } = props;
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(props.value);

    // Focus menu when opened
    useEffect(() => {
        if (open) {
            // Find the listbox and focus it
            // We use a timeout to ensure popover is rendered
            setTimeout(() => {
                const listbox = document.querySelector('[role="listbox"]') as HTMLElement;
                listbox?.focus();
            }, 0);
        }
    }, [open]);

    const clickHandler = () => setOpen(true);

    const keyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.keyCode === 40) {
            setOpen(true);
        }
    };

    const changeHandler = (val: T | T[]) => {
        setValue(val);
        onChange?.(val);

        // Close dropdown after selection if not multiSelect
        if (!multiSelect) {
            setOpen(false);
        }
    };

    return (
        <Popover
            position={POPOVER_POSITION.BOTTOM_LEFT}
            open={open}
            element={() => (
                <>
                    <Input
                        type="text"
                        value={value && String(value)}
                        label={props.label}
                        errorText={props.errorText}
                        onClick={clickHandler}
                        onKeyUp={keyUp}
                        required={props.required}
                        disabled={props.disabled}
                    />
                    <ArrowContainer>
                        <ExpandMore />
                    </ArrowContainer>
                </>
            )}
            onClose={() => setOpen(false)}
        >
            <Menu value={value} multiSelect={multiSelect} onChange={changeHandler}>
                {props.children}
            </Menu>
        </Popover>
    );
}

Dropdown.defaultProps = {
    multiSelect: false,
};
