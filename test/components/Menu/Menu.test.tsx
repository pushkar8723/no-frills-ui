import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Menu, MenuItem } from '../../../src/components/Menu';

expect.extend(toHaveNoViolations);

describe('Menu', () => {
    const mockOptions = [
        { id: '1', label: 'Option 1' },
        { id: '2', label: 'Option 2' },
    ];

    it('renders menu items', () => {
        const { getByRole } = render(
            <Menu aria-label="Test menu">
                {mockOptions.map((option) => (
                    <MenuItem key={option.id} value={option}>
                        {option.label}
                    </MenuItem>
                ))}
            </Menu>,
        );
        const listbox = getByRole('listbox');
        expect(listbox).toBeInTheDocument();
    });

    it('handles selection in single mode', async () => {
        const handleChange = jest.fn();
        const { getByRole } = render(
            <Menu aria-label="Test menu" onChange={handleChange}>
                {mockOptions.map((option) => (
                    <MenuItem key={option.id} value={option}>
                        {option.label}
                    </MenuItem>
                ))}
            </Menu>,
        );

        const option = getByRole('option', { name: 'Option 1' });
        fireEvent.click(option);

        expect(handleChange).toHaveBeenCalledWith(mockOptions[0]);
    });

    it('handles multi-select mode', async () => {
        const handleChange = jest.fn();
        const { getByRole } = render(
            <Menu aria-label="Test menu" multiSelect onChange={handleChange}>
                {mockOptions.map((option) => (
                    <MenuItem key={option.id} value={option}>
                        {option.label}
                    </MenuItem>
                ))}
            </Menu>,
        );

        const option1 = getByRole('option', { name: 'Option 1' });
        const option2 = getByRole('option', { name: 'Option 2' });

        fireEvent.click(option1);
        fireEvent.click(option2);

        expect(handleChange).toHaveBeenCalledWith([mockOptions[0], mockOptions[1]]);
    });

    it('shows selected state', () => {
        const { getByRole } = render(
            <Menu aria-label="Test menu" value={mockOptions[0]}>
                {mockOptions.map((option) => (
                    <MenuItem key={option.id} value={option}>
                        {option.label}
                    </MenuItem>
                ))}
            </Menu>,
        );

        const option = getByRole('option', { name: 'Option 1' });
        expect(option).toHaveAttribute('aria-selected', 'true');
    });

    it('forwards ref correctly', () => {
        const ref = React.createRef<HTMLDivElement>();
        render(
            <Menu ref={ref}>
                <MenuItem value="test">Test</MenuItem>
            </Menu>,
        );
        expect(ref.current).toBeInTheDocument();
    });

    it('handles keyboard navigation with arrow keys', () => {
        const { getAllByRole } = render(
            <Menu aria-label="Test menu">
                {mockOptions.map((option) => (
                    <MenuItem key={option.id} value={option}>
                        {option.label}
                    </MenuItem>
                ))}
            </Menu>,
        );

        const options = getAllByRole('option');
        const firstOption = options[0];
        const secondOption = options[1];

        // Focus first option
        firstOption.focus();
        expect(document.activeElement).toBe(firstOption);

        // Arrow down to second option
        fireEvent.keyDown(firstOption, { key: 'ArrowDown', code: 'ArrowDown' });
        expect(document.activeElement).toBe(secondOption);

        // Arrow up back to first option
        fireEvent.keyDown(secondOption, { key: 'ArrowUp', code: 'ArrowUp' });
        expect(document.activeElement).toBe(firstOption);
    });

    it('handles keyboard navigation wrapping', () => {
        const { getAllByRole } = render(
            <Menu aria-label="Test menu">
                {mockOptions.map((option) => (
                    <MenuItem key={option.id} value={option}>
                        {option.label}
                    </MenuItem>
                ))}
            </Menu>,
        );

        const options = getAllByRole('option');
        const firstOption = options[0];
        const lastOption = options[options.length - 1];

        // Focus first option
        firstOption.focus();

        // Arrow up from first should go to last
        fireEvent.keyDown(firstOption, { key: 'ArrowUp', code: 'ArrowUp' });
        expect(document.activeElement).toBe(lastOption);

        // Arrow down from last should go to first
        fireEvent.keyDown(lastOption, { key: 'ArrowDown', code: 'ArrowDown' });
        expect(document.activeElement).toBe(firstOption);
    });

    it('handles Home and End keys', () => {
        const { getAllByRole } = render(
            <Menu aria-label="Test menu">
                {mockOptions.map((option) => (
                    <MenuItem key={option.id} value={option}>
                        {option.label}
                    </MenuItem>
                ))}
            </Menu>,
        );

        const options = getAllByRole('option');
        const firstOption = options[0];
        const lastOption = options[options.length - 1];

        // Focus last option first
        lastOption.focus();

        // Home key should go to first option
        fireEvent.keyDown(lastOption, { key: 'Home', code: 'Home' });
        expect(document.activeElement).toBe(firstOption);

        // End key should go to last option
        fireEvent.keyDown(firstOption, { key: 'End', code: 'End' });
        expect(document.activeElement).toBe(lastOption);
    });

    it('handles Enter key for selection', () => {
        const handleChange = jest.fn();
        const { getAllByRole } = render(
            <Menu aria-label="Test menu" onChange={handleChange}>
                {mockOptions.map((option) => (
                    <MenuItem key={option.id} value={option}>
                        {option.label}
                    </MenuItem>
                ))}
            </Menu>,
        );

        const options = getAllByRole('option');
        const firstOption = options[0];

        // Focus and press Enter
        firstOption.focus();
        fireEvent.keyDown(firstOption, { key: 'Enter', code: 'Enter' });

        expect(handleChange).toHaveBeenCalledWith(mockOptions[0]);
    });

    it('handles Space key for selection', () => {
        const handleChange = jest.fn();
        const { getAllByRole } = render(
            <Menu aria-label="Test menu" onChange={handleChange}>
                {mockOptions.map((option) => (
                    <MenuItem key={option.id} value={option}>
                        {option.label}
                    </MenuItem>
                ))}
            </Menu>,
        );

        const options = getAllByRole('option');
        const firstOption = options[0];

        // Focus and press Space
        firstOption.focus();
        fireEvent.keyDown(firstOption, { key: ' ', code: 'Space' });

        expect(handleChange).toHaveBeenCalledWith(mockOptions[0]);
    });

    it('handles keyboard navigation in multi-select mode', () => {
        const handleChange = jest.fn();
        const { getAllByRole } = render(
            <Menu aria-label="Test menu" multiSelect onChange={handleChange}>
                {mockOptions.map((option) => (
                    <MenuItem key={option.id} value={option}>
                        {option.label}
                    </MenuItem>
                ))}
            </Menu>,
        );

        const options = getAllByRole('option');
        const firstOption = options[0];
        const secondOption = options[1];

        // Focus first option and select with Enter
        firstOption.focus();
        fireEvent.keyDown(firstOption, { key: 'Enter', code: 'Enter' });
        expect(handleChange).toHaveBeenCalledWith([mockOptions[0]]);

        // Navigate to second option and select with Space
        fireEvent.keyDown(firstOption, { key: 'ArrowDown', code: 'ArrowDown' });
        expect(document.activeElement).toBe(secondOption);

        fireEvent.keyDown(secondOption, { key: ' ', code: 'Space' });
        expect(handleChange).toHaveBeenCalledWith([mockOptions[0], mockOptions[1]]);
    });

    it('delegates focus to first item when container receives focus', () => {
        const { getByRole, getAllByRole } = render(
            <Menu aria-label="Test menu">
                {mockOptions.map((option) => (
                    <MenuItem key={option.id} value={option}>
                        {option.label}
                    </MenuItem>
                ))}
            </Menu>,
        );

        const listbox = getByRole('listbox');
        const firstOption = getAllByRole('option')[0];

        // Focus the container
        listbox.focus();

        // Focus should be delegated to first item
        expect(document.activeElement).toBe(firstOption);
    });

    it('prevents default behavior for navigation keys', () => {
        const { getAllByRole } = render(
            <Menu aria-label="Test menu">
                {mockOptions.map((option) => (
                    <MenuItem key={option.id} value={option}>
                        {option.label}
                    </MenuItem>
                ))}
            </Menu>,
        );

        const options = getAllByRole('option');
        const firstOption = options[0];

        firstOption.focus();

        // Test that preventDefault is called for navigation keys
        const arrowDownEvent = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
        const preventDefaultSpy = jest.spyOn(arrowDownEvent, 'preventDefault');

        firstOption.dispatchEvent(arrowDownEvent);
        expect(preventDefaultSpy).toHaveBeenCalled();
    });
    it('is accessible', async () => {
        const { container } = render(
            <Menu aria-label="Test menu">
                <MenuItem value="test">Test</MenuItem>
            </Menu>,
        );
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
