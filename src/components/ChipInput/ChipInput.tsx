import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import constants from '../../shared/constants';
import Chip from '../Chip/Chip';
import { DragAndDrop, ORIENTATION } from '../DragAndDrop';

type ChipInputProps = PropTypes.InferProps<typeof ChipInput.propTypes>;

const Label = styled.label`
    display: inline-flex;
    flex-direction: column;
    flex: 1;
    position: relative;
    margin: 10px 5px;
`;

const Container = styled.div<{
    text: string,
    touched?: boolean,
    errorText?: string
}>`
    color: inherit;
    padding: 0 8px;
    line-height: 30px;
    min-height: 30px;
    width: 250px;
    border-radius: 3px;
    border: 1px solid var(--border-color, ${constants.BORDER_COLOR});
    display: inline-block;
    background-color: var(--background, ${constants.BACKGROUND});

    /** Focused */
    &:has(:focus), &:has(:active) {
        border-color: var(--primary, ${constants.PRIMARY});
        box-shadow: 0 0 0 4px var(--primary-light, ${constants.PRIMARY_LIGHT});
    }

    &:has(:focus) + span, &:has(:active) + span {
        color: var(--primary, ${constants.PRIMARY});
    }

    /** Disabled */
    &:has(:disabled) {
        border-color: var(--disabled-border, ${constants.DISABLED_BORDER});
        background-color: var(--disabled-background, ${constants.DISABLED_BACKGROUND});
    }
    
    &:has(:disabled) + span {
        color: #777;
    }

    /** Invalid */
    &:has(:focus:invalid) {
        border-color: var(--error, ${constants.ERROR});
        box-shadow: 0 0 0 4px var(--error-light, ${constants.ERROR_LIGHT});
    }

    ${props => props.touched ? `
        &:has(:invalid) {
            border-color: var(--error, ${constants.ERROR});
        }
    
        &:has(:invalid) + span {
            color: var(--error, ${constants.ERROR});
        }
        ` : ''}
    
    /** Error */
    ${props => props.errorText ? `
        border-color: var(--error, ${constants.ERROR});

        & + span {
            color: var(--error, ${constants.ERROR});
        }
        ` : ''}

    /** Required */
    &:has(:required) + span:after {
        content: '*';
        margin-left: 2px;
        color: var(--error, ${constants.ERROR});
    }

    & > input {
        border: none;
        width: 100%;
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

    &:has(:focus) + span, &:has(:placeholder-shown) + span {
        top: -8px;
        background: var(--background, ${constants.BACKGROUND});
        font-size: 12px;
        line-height: 14px;
    }

    ${props => props.text !== '' ? `
    & + span {
        top: -8px;
        background: var(--background, ${constants.BACKGROUND});
        font-size: 12px;
        line-height: 14px;
    }
    `: ''}
`;

const ErrorContainer = styled.div`
    color: var(--error, ${constants.ERROR});
    padding-top: 3px;
    font-size: 12px;
        line-height: 14px;
    margin-left: 3px;
`;

export default function ChipInput(props: ChipInputProps & React.AllHTMLAttributes<HTMLInputElement>) {
    const [text, setText] = useState('');
    const [touched, setTouched] = useState(false);
    const [value, setValue] = useState<string[]>(props.value);
    const InputRef = React.useRef<HTMLInputElement>(null);

    const updateValue = (newValue: string[]) => {
        setValue(Array.from(new Set(newValue)));
        props.onChange?.(newValue);
    }

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        setTouched(true);
        if (props.onFocus) {
            props.onFocus(e);
        }
    }

    const handleChange:React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setText(e.target.value);
    }

    const handleKeyUp:React.KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === 'Enter' && text.trim() !== '') {
            const newValue = [...value, text.trim()];
            updateValue(newValue);
            setText('');
        }
    }

    const removeChip = (chipToRemove: string) => {
        const newValue = value.filter(chip => chip !== chipToRemove);
        updateValue(newValue);
    }

    const onDrop = (start: number, end: number) => {
        // Clone existing elements
        const newItems = [...value];
        // Remove the element to be moved
        const item = newItems.splice(start, 1);
        // Add it back at the required position
        newItems.splice(end, 0, item[0]);
        // Update
        setValue(newItems);
    }

    return (
        <Label>
            <Container
                text={text}
                touched={touched}
                errorText={props.errorText}
            >
                <input 
                    {...props} 
                    ref={InputRef}
                    type="text"
                    value={text}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onKeyUp={handleKeyUp}
                />
                <div>
                    {value?.length > 0 && (
                        <DragAndDrop orientation={ORIENTATION.HORIZONTAL} onDrop={onDrop}>
                            {value.map((chip) => (

                                <Chip key={chip} label={chip} onCloseClick={() => removeChip(chip)} />
                            ))}
                        </DragAndDrop>
                    )}
                </div>
            </Container>
            <span>{props.label}</span>
            { props.errorText && <ErrorContainer>{props.errorText}</ErrorContainer> }
        </Label>
    );
}

ChipInput.propTypes = {
    /** Label for the field */
    label: PropTypes.string.isRequired,
    /** Error message for the field */
    errorText: PropTypes.string,
    /** Values to display as chips */
    value: PropTypes.arrayOf(PropTypes.string),
    /** Callback when chips change */
    onChange: PropTypes.func,
}

ChipInput.defaultProps = {
    value: [],
    minChips: 0,
};
