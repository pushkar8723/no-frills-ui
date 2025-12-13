import React, { useState, ReactNode, ForwardedRef } from 'react';
import styled from '@emotion/styled';
import { getThemeValue, THEME_NAME } from '../../shared/constants';
import MenuContext from './MenuContext';
/**
 * Props for the Menu component.
 * @template T - The type of value(s) in the menu.
 */
interface MenuProps<T> {
    /** Multiple Menu Items can be selected */
    multiSelect?: boolean;
    /** Value(s) selected */
    value?: T | T[];
    /** Callback when the selected value changes */
    onChange?: (value: T | T[]) => void;
    /** Menu Items */
    children?: ReactNode;
}

const MenuContainer = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;

    & div:last-child {
        border-bottom: none;
    }

    &:focus-within {
        box-shadow: 0 0 0 4px ${getThemeValue(THEME_NAME.PRIMARY_LIGHT)};
    }
`;

/**
 * Menu component that allows selection of items from a list.
 * Supports single and multi-select modes and keyboard navigation.
 *
 * @template T - The type of value(s) in the menu.
 * @param {MenuProps<T> & Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>} props - The menu properties.
 * @param {ForwardedRef<HTMLDivElement>} ref - The ref forwarded to the menu container.
 */
const Menu = React.forwardRef(function <T extends object>(
    props: MenuProps<T> & Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>,
    ref: ForwardedRef<HTMLDivElement>,
) {
    const { multiSelect, onChange, value: propValue, ...rest } = props;
    const [value, setValue] = useState(propValue || (multiSelect ? [] : ''));

    /**
     * Updates the selected value(s).
     * Handles both single and multi-select logic.
     *
     * @param {T} val - The value to select or deselect.
     */
    const updateValue = (val: T) => {
        let newVal;
        if (multiSelect) {
            if (Array.isArray(value)) {
                if (value.includes(val)) {
                    newVal = value.filter((item) => item !== val);
                } else {
                    newVal = [...value, val];
                }
            }
        } else {
            newVal = val;
        }
        setValue(newVal);
        onChange?.(newVal);
    };

    /**
     * Handles keyboard navigation within the menu.
     * Supports Arrow keys for navigation, and Enter/Space for selection.
     *
     * @param {React.KeyboardEvent} e - The keyboard event.
     */
    const handleKeyDown = (e: React.KeyboardEvent) => {
        const target = e.target as HTMLElement;
        const container = e.currentTarget as HTMLElement;
        const items = Array.from(container.querySelectorAll('[role="option"]')) as HTMLElement[];
        const currentIndex = items.indexOf(target as HTMLElement);

        let nextIndex;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                nextIndex = currentIndex + 1;
                if (nextIndex >= items.length) nextIndex = 0;
                items[nextIndex]?.focus();
                break;
            case 'ArrowUp':
                e.preventDefault();
                nextIndex = currentIndex - 1;
                if (nextIndex < 0) nextIndex = items.length - 1;
                items[nextIndex]?.focus();
                break;
            case 'Home':
                e.preventDefault();
                items[0]?.focus();
                break;
            case 'End':
                e.preventDefault();
                items[items.length - 1]?.focus();
                break;
            case 'Enter':
            case ' ': // Space
                e.preventDefault();
                target.click();
                break;
            default:
                break;
        }
    };

    /**
     * Handles focus events on the menu container.
     * Delegates focus to the first item if the container itself receives focus.
     *
     * @param {React.FocusEvent} e - The focus event.
     */
    const focusHandler = (e: React.FocusEvent) => {
        // Prevent trap: If focus came from inside (Shift+Tab), do NOT auto-focus again.
        // This allows focus to land on the container, and the next Shift+Tab will exit.
        if (e.currentTarget.contains(e.relatedTarget as Node)) {
            return;
        }

        // Only if focus is actually on the container (e.g. tabbing into it)
        // and not bubbling up from a child
        if (e.target === e.currentTarget) {
            // Prevent the container from holding focus; delegate to first item
            const firstItem = e.currentTarget.querySelector('[role="option"]') as HTMLElement;
            firstItem?.focus();
        }
    };

    return (
        <MenuContext.Provider
            value={
                {
                    value,
                    multiSelect,
                    updateValue,
                } as unknown as React.ContextType<typeof MenuContext>
            }
        >
            <MenuContainer
                {...rest}
                ref={ref}
                role="listbox"
                aria-multiselectable={multiSelect}
                tabIndex={0}
                onKeyDown={handleKeyDown}
                onFocus={focusHandler}
            >
                {props.children}
            </MenuContainer>
        </MenuContext.Provider>
    );
});

Menu.displayName = 'Menu';

Menu.defaultProps = {
    multiSelect: false,
};

export default Menu;
