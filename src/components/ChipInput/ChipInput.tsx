import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import constants from '../../shared/constants';
import Chip from '../Chip/Chip';
import { DragAndDrop, ORIENTATION } from '../DragAndDrop';

// Prop types definition
type ChipInputProps = PropTypes.InferProps<typeof ChipInput.propTypes>;

// Label component for the ChipInput
const Label = styled.label`
    display: inline-flex;
    flex-direction: column;
    flex: 1;
    position: relative;
    margin: 10px 5px;
`;

// Container component for the ChipInput
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

// Error message container
const ErrorContainer = styled.div`
    color: var(--error, ${constants.ERROR});
    padding-top: 3px;
    font-size: 12px;
        line-height: 14px;
    margin-left: 3px;
`;

/**
 * A chip input component that allows users to add and remove chips (tags) by typing and pressing Enter.
 * @component
 * @example
 * ```tsx
 * <ChipInput
 *   value={['tag1', 'tag2']}
 *   onChange={(newTags) => console.log(newTags)}
 *   label="Add tags"
 *   errorText="At least one tag is required"
 * />
 * ```
 */
export default function ChipInput(props: ChipInputProps & React.AllHTMLAttributes<HTMLInputElement>) {
    const [text, setText] = useState('');
    const [touched, setTouched] = useState(false);
    const [value, setValue] = useState<string[]>(props.value);
    const InputRef = React.useRef<HTMLInputElement>(null);

    /**
     * Update the chip values and notify changes.
     * @param newValue The new array of chip values
     */
    const updateValue = (newValue: string[]) => {
        setValue(Array.from(new Set(newValue)));
        props.onChange?.(newValue);
    }

    /**
     * Marks the input as touched on focus.
     * @param e React focus event
     */
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        setTouched(true);
        if (props.onFocus) {
            props.onFocus(e);
        }
    }

    /**
     * Change handler for the input field.
     * @param e React change event
     */
    const handleChange:React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setText(e.target.value);
    }

    /**
     * Adds a new chip on Enter key press.
     * @param e React keyboard event
     */
    const handleKeyUp:React.KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === 'Enter' && text.trim() !== '') {
            const newValue = [...value, text.trim()];
            updateValue(newValue);
            setText('');
        }
    }

    /**
     * Removes a chip from the list.
     * @param chipToRemove The chip value to remove
     */
    const removeChip = (chipToRemove: string) => {
        const newValue = value.filter(chip => chip !== chipToRemove);
        updateValue(newValue);
    }

    /**
     * Moves a chip from one position to another.
     * @param start The starting index of the item to move
     * @param end The ending index where the item should be placed
     */
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

    // Render the component
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
