import React, { useImperativeHandle, useEffect, useId, useState } from 'react';
import styled from '@emotion/styled';
import { getThemeValue, THEME_NAME } from '../../shared/constants';
import Chip from '../Chip/Chip';
import { DragAndDrop, ORIENTATION } from '../DragAndDrop';

// Prop types definition
interface ChipInputProps {
    /** Label for the field */
    label: string;
    /** Error message for the field */
    errorText?: string;
    /**
     * Values to display as chips
     * @default []
     */
    value?: string[];
    /** Callback when chips change */
    onChange?: (newValue: string[]) => void;
    /**
     * Aria label for the close button on chip. Defaults to "Remove {:label}"
     * @default "Remove {:label}"
     */
    closeButtonAriaLabel?: string;
    /**
     * Announcement text when a chip is added. Defaults to "{:label} was added"
     * @default "{:label} was added"
     */
    addedAnnouncementTemplate?: string;
    /**
     * Announcement text when a chip is removed. Defaults to "{:label} was removed"
     * @default "{:label} was removed"
     */
    removedAnnouncementTemplate?: string;
}

// Container for the ChipInput
const Container = styled.div`
    margin: 10px 5px;
`;

// Label component for the ChipInput
const Label = styled.label<{
    text: string;
    touched?: boolean;
    errorText?: string;
    required?: boolean;
    width?: string | number;
}>`
    display: inline-flex;
    flex-direction: column;
    flex: 1;
    position: relative;
    color: inherit;
    padding: 0 8px;
    border-radius: 3px;
    border: 1px solid ${getThemeValue(THEME_NAME.BORDER_COLOR)};
    background-color: ${getThemeValue(THEME_NAME.BACKGROUND)};
    width: ${(props) =>
        typeof props.width === 'number' ? `${props.width}px` : props.width || '250px'};
    max-width: 100%;

    /** Focused */
    &:has(:focus),
    &:has(:active) {
        border-color: ${getThemeValue(THEME_NAME.PRIMARY)};
        box-shadow: 0 0 0 4px ${getThemeValue(THEME_NAME.PRIMARY_LIGHT)};
    }

    &:has(:focus) > span,
    &:has(:active) > span {
        color: ${getThemeValue(THEME_NAME.PRIMARY)};
    }

    /** Disabled */
    &:has(:disabled) {
        border-color: ${getThemeValue(THEME_NAME.DISABLED_BORDER)};
        background-color: ${getThemeValue(THEME_NAME.DISABLED_BACKGROUND)};
    }

    &:has(:disabled) > span {
        color: ${getThemeValue(THEME_NAME.DISABLED)};
    }

    /** Invalid */
    &:has(:focus:invalid) {
        border-color: ${getThemeValue(THEME_NAME.ERROR)};
        box-shadow: 0 0 0 4px ${getThemeValue(THEME_NAME.ERROR_LIGHT)};
    }

    ${(props) =>
        props.touched
            ? `
        &:has(:invalid) {
            border-color: ${getThemeValue(THEME_NAME.ERROR)};
        }
    
        &:has(:invalid) > span {
            color: ${getThemeValue(THEME_NAME.ERROR)};
        }
        `
            : ''}

    /** Error */
    ${(props) =>
        props.errorText
            ? `
        border-color: ${getThemeValue(THEME_NAME.ERROR)};

        & > span {
            color: ${getThemeValue(THEME_NAME.ERROR)};
        }
        `
            : ''}

    /** Required */
    ${(props) =>
        props.required
            ? `& > span:after {
                content: '*';
                margin-left: 2px;
                color: ${getThemeValue(THEME_NAME.ERROR)};
            }`
            : ''}
    

    & > input {
        border: none;
        outline: none;
        line-height: 30px;
        min-height: 30px;
        max-width: 95%;
    }

    /** Label Animation */
    & > span {
        position: absolute;
        padding: 0 5px;
        top: 0px;
        left: 4px;
        font-size: 14px;
        line-height: 32px;
        transition: all 300ms ease;
    }

    &:has(:focus) > span,
    &:has(:placeholder-shown) > span {
        top: -8px;
        background: ${getThemeValue(THEME_NAME.BACKGROUND)};
        font-size: 12px;
        line-height: 14px;
    }

    ${(props) =>
        props.text !== ''
            ? `
    & > span {
        top: -8px;
        background: ${getThemeValue(THEME_NAME.BACKGROUND)};
        font-size: 12px;
        line-height: 14px;
    }
    `
            : ''}
`;

// Error message container
const ErrorContainer = styled.div`
    color: ${getThemeValue(THEME_NAME.ERROR)};
    padding-top: 3px;
    font-size: 12px;
    line-height: 14px;
    margin-left: 3px;
`;

// Visually hidden but accessible to screen readers
const VisuallyHidden = styled.ul`
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;

    & li {
        list-style: none;
    }
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
function ChipInputComponent(
    props: ChipInputProps & Omit<React.AllHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>,
    ref: React.Ref<HTMLInputElement | null>,
) {
    const {
        value: propValue = [],
        onChange: onChangeCallback,
        label,
        errorText,
        closeButtonAriaLabel = `Remove {:label}`,
        addedAnnouncementTemplate = '{:label} was added',
        removedAnnouncementTemplate = '{:label} was removed',
        width,
        ...inputProps
    } = props;

    const [text, setText] = useState('');
    const [touched, setTouched] = useState(false);
    const [value, setValue] = useState<string[]>(propValue || []);
    const InputRef = React.useRef<HTMLInputElement>(null);
    const [announcement, setAnnouncement] = useState('');
    const errorId = useId();

    // Forward the underlying input element.
    useImperativeHandle(ref, () => InputRef.current as HTMLInputElement);

    /**
     * Replace {:label} placeholder in template string
     */
    const replacePlaceholder = (
        template: string | undefined,
        label: string,
    ): string | undefined => {
        if (!template) return undefined;
        return template.replace(/\{:label\}/g, label);
    };

    const prevPropValueRef = React.useRef<string[]>(undefined);

    // Sync internal value with props.value
    useEffect(() => {
        if (Array.isArray(propValue)) {
            const prevValue = prevPropValueRef.current;
            const isEqual =
                prevValue &&
                propValue.length === prevValue.length &&
                propValue.every((val, index) => val === prevValue[index]);
            if (!isEqual) {
                setValue(propValue);
                prevPropValueRef.current = propValue;
            }
        }
    }, [propValue]);

    useEffect(() => {
        if (InputRef.current) {
            InputRef.current.setCustomValidity(errorText || '');
        }
    }, [errorText]);

    /**
     * Update the chip values and notify changes.
     * @param newValue The new array of chip values
     */
    const updateValue = (newValue: string[]) => {
        const deduped = Array.from(new Set(newValue));
        setValue(deduped);
        onChangeCallback?.(deduped);
    };

    /**
     * Marks the input as touched on focus.
     * @param e React focus event
     */
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        setTouched(true);
        if (inputProps.onFocus) {
            inputProps.onFocus(e);
        }
    };

    /**
     * Change handler for the input field.
     * @param e React change event
     */
    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setText(e.target.value);
    };

    /**
     * Adds a new chip on Enter key press.
     * @param e React keyboard event
     */
    const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === 'Enter') {
            // Check validity against HTML5 constraints only (ignore custom validity from errorText)
            let isValid;
            if (InputRef.current) {
                InputRef.current.setCustomValidity('');
                isValid = InputRef.current.checkValidity();
                InputRef.current.setCustomValidity(errorText || '');
            }

            // Only prevent form submission if we have valid text to add as a chip
            if (text.trim() !== '' && isValid) {
                e.preventDefault();
                e.stopPropagation();
                const newValue = [...value, text.trim()];
                updateValue(newValue);
                setText('');
                setAnnouncement(replacePlaceholder(addedAnnouncementTemplate, text.trim())!);
            }
            // Otherwise, allow form submission to proceed
        }
    };

    /**
     * Removes a chip from the list.
     * @param chipToRemove The chip value to remove
     */
    const removeChip = (chipToRemove: string) => {
        const newValue = value.filter((chip) => chip !== chipToRemove);
        updateValue(newValue);
        setAnnouncement(replacePlaceholder(removedAnnouncementTemplate, chipToRemove)!);
    };

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
        updateValue(newItems);
    };

    // Render the component
    return (
        <>
            <Container>
                <Label
                    text={text}
                    touched={touched}
                    errorText={errorText}
                    required={inputProps.required}
                    width={width}
                >
                    <input
                        {...inputProps}
                        ref={InputRef}
                        value={text}
                        onChange={handleChange}
                        onFocus={handleFocus}
                        onKeyDown={handleKeyDown}
                        required={inputProps.required && value.length === 0}
                        aria-required={inputProps.required}
                        aria-invalid={!!errorText}
                        aria-describedby={errorText ? errorId : undefined}
                    />
                    <div>
                        {value?.length > 0 && (
                            <DragAndDrop orientation={ORIENTATION.HORIZONTAL} onDrop={onDrop}>
                                {value.map((chip) => (
                                    <Chip
                                        key={chip}
                                        label={chip}
                                        onCloseClick={() => removeChip(chip)}
                                        closeButtonAriaLabel={replacePlaceholder(
                                            closeButtonAriaLabel,
                                            chip,
                                        )}
                                    />
                                ))}
                            </DragAndDrop>
                        )}
                    </div>
                    <span>{label}</span>
                </Label>
                {errorText && <ErrorContainer id={errorId}>{errorText}</ErrorContainer>}
            </Container>
            <VisuallyHidden aria-live="polite" aria-atomic="true">
                {announcement}
            </VisuallyHidden>
        </>
    );
}

const ChipInput = React.forwardRef<
    HTMLInputElement,
    ChipInputProps & Omit<React.AllHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>
>(ChipInputComponent);

export default ChipInput;
