import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { Menu } from '../Menu';
import { Popover, POPOVER_POSITION } from '../Popover';
import Input from './Input';
import { ExpandMore } from '../../icons';

type DropdownProps<T> = React.PropsWithChildren<PropTypes.InferProps<typeof Dropdown.propTypes>>;

const ArrowContainer = styled.span`
    position: absolute;
    right: 12px;
    top: 16px;
`;

export default function Dropdown<T>(props: DropdownProps<T>) {
    const { multiSelect, onChange } = props;
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(props.value);

    const clickHandler = () => setOpen(true);
    
    const keyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.keyCode === 40) {
            setOpen(true);
        }
    }

    const changeHandler = (val: T | T[]) => {
        setValue(val);
        onChange?.(val);
    }

    return (
        <Popover
            position={POPOVER_POSITION.BOTTOM_LEFT}
            open={open}
            element={() => (
                <>
                <Input
                    type='text'
                    value={value && String(value)}
                    label={props.label}
                    errorText={props.errorText}
                    onClick={clickHandler}
                    onKeyUp={keyUp}
                    required={props.required}
                    disabled={props.disabled}
                />
                <ArrowContainer><ExpandMore /></ArrowContainer>
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

Dropdown.propTypes = {
    /** Value of the control */
    value: PropTypes.oneOfType([PropTypes.any, PropTypes.arrayOf(PropTypes.any)]),
    /** If multiple elements can be selected */
    multiSelect: PropTypes.bool,
    /** CHange handler */
    onChange: PropTypes.func,
    /** Label of the control */
    label: PropTypes.string,
    /** Error message */
    errorText: PropTypes.string,
    /** Makes field required */
    required: PropTypes.bool,
    /** Disables the field */
    disabled: PropTypes.bool
};

Dropdown.defaultProps = {
    multiSelect: false,
}
