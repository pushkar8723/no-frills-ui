import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Dropdown } from '../../../src/components/Input';
import { MenuItem } from '../../../src/components/Menu';

expect.extend(toHaveNoViolations);

describe('Dropdown', () => {
    type OptionType = { id: string; label: string };

    const mockOptions: OptionType[] = [
        { id: '1', label: 'Option 1' },
        { id: '2', label: 'Option 2' },
        { id: '3', label: 'Option 3' },
    ];

    it('renders with label', () => {
        const { getByText } = render(
            <Dropdown label="Test Dropdown">
                {mockOptions.map((option) => (
                    <MenuItem key={option.id} value={option}>
                        {option.label}
                    </MenuItem>
                ))}
            </Dropdown>,
        );
        expect(getByText('Test Dropdown')).toBeInTheDocument();
    });

    it('displays initial value', () => {
        const selectedOption = mockOptions[1];
        const { getByRole } = render(
            <Dropdown value={selectedOption}>
                {mockOptions.map((option) => (
                    <MenuItem key={option.id} value={option}>
                        {option.label}
                    </MenuItem>
                ))}
            </Dropdown>,
        );
        const input = getByRole('combobox');
        expect(input).toHaveValue('Option 2');
    });

    it('opens dropdown on click', async () => {
        const { getByRole, queryByRole } = render(
            <Dropdown label="Test">
                {mockOptions.map((option) => (
                    <MenuItem key={option.id} value={option}>
                        {option.label}
                    </MenuItem>
                ))}
            </Dropdown>,
        );

        const trigger = getByRole('combobox');
        expect(queryByRole('listbox')).not.toBeInTheDocument();

        fireEvent.click(trigger);

        await waitFor(() => {
            expect(getByRole('listbox')).toBeInTheDocument();
        });
    });

    it('opens dropdown on keyboard navigation', async () => {
        const user = userEvent.setup();
        const { getByRole } = render(
            <Dropdown label="Test">
                {mockOptions.map((option) => (
                    <MenuItem key={option.id} value={option}>
                        {option.label}
                    </MenuItem>
                ))}
            </Dropdown>,
        );

        const trigger = getByRole('combobox');
        await user.type(trigger, '{arrowdown}');

        await waitFor(() => {
            expect(getByRole('listbox')).toBeInTheDocument();
        });
    });

    it('selects option and closes dropdown', async () => {
        const handleChange = jest.fn();
        const { getByRole, queryByRole } = render(
            <Dropdown label="Test" onChange={handleChange}>
                {mockOptions.map((option) => (
                    <MenuItem key={option.id} value={option}>
                        {option.label}
                    </MenuItem>
                ))}
            </Dropdown>,
        );

        const trigger = getByRole('combobox');
        fireEvent.click(trigger);

        const option = await waitFor(() => getByRole('option', { name: 'Option 1' }));
        fireEvent.click(option);

        expect(handleChange).toHaveBeenCalledWith(mockOptions[0]);
        await waitFor(() => {
            expect(queryByRole('listbox')).not.toBeInTheDocument();
        });
    });

    it('supports multi-select mode', async () => {
        const handleChange = jest.fn();
        const { getByRole } = render(
            <Dropdown label="Test" multiSelect onChange={handleChange}>
                {mockOptions.map((option) => (
                    <MenuItem key={option.id} value={option}>
                        {option.label}
                    </MenuItem>
                ))}
            </Dropdown>,
        );

        const trigger = getByRole('combobox');
        fireEvent.click(trigger);

        const option1 = await waitFor(() => getByRole('option', { name: 'Option 1' }));
        const option2 = getByRole('option', { name: 'Option 2' });

        fireEvent.click(option1);
        fireEvent.click(option2);

        expect(handleChange).toHaveBeenCalledWith([mockOptions[0], mockOptions[1]]);
    });

    it('handles disabled state', () => {
        const { getByRole } = render(
            <Dropdown label="Test" disabled>
                {mockOptions.map((option) => (
                    <MenuItem key={option.id} value={option}>
                        {option.label}
                    </MenuItem>
                ))}
            </Dropdown>,
        );

        const trigger = getByRole('combobox');
        expect(trigger).toBeDisabled();
    });

    it('handles required state', () => {
        const { getByRole } = render(
            <Dropdown label="Test" required>
                {mockOptions.map((option) => (
                    <MenuItem key={option.id} value={option}>
                        {option.label}
                    </MenuItem>
                ))}
            </Dropdown>,
        );

        const trigger = getByRole('combobox');
        expect(trigger).toHaveAttribute('required');
    });

    it('displays error text', () => {
        const { getByText } = render(
            <Dropdown label="Test" errorText="This is an error">
                {mockOptions.map((option) => (
                    <MenuItem key={option.id} value={option}>
                        {option.label}
                    </MenuItem>
                ))}
            </Dropdown>,
        );

        expect(getByText('This is an error')).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
        const ref = React.createRef<HTMLInputElement>();
        render(
            <Dropdown ref={ref} label="Test">
                {mockOptions.map((option) => (
                    <MenuItem key={option.id} value={option}>
                        {option.label}
                    </MenuItem>
                ))}
            </Dropdown>,
        );

        expect(ref.current).toBeInTheDocument();
        expect(ref.current?.tagName).toBe('INPUT');
    });

    // Skipped due to jsdom limitation: Popover uses document event listeners for outside click,
    // which may not work as expected in the test environment.
    it('closes on outside click', async () => {
        const user = userEvent.setup();
        const { getByRole, queryByRole, getByTestId } = render(
            <div>
                <Dropdown label="Test">
                    {mockOptions.map((option) => (
                        <MenuItem key={option.id} value={option}>
                            {option.label}
                        </MenuItem>
                    ))}
                </Dropdown>
                <div data-testid="outside">Outside</div>
            </div>,
        );

        const trigger = getByRole('combobox');
        await user.click(trigger);

        await waitFor(() => {
            expect(getByRole('listbox')).toBeInTheDocument();
        });

        // Wait a bit for requestAnimationFrame in Popover to register the click listener
        await new Promise((resolve) => setTimeout(resolve, 50));

        // Click outside
        const outside = getByTestId('outside');
        await user.click(outside);

        await waitFor(
            () => {
                expect(queryByRole('listbox')).not.toBeInTheDocument();
            },
            { timeout: 2000 },
        );
    });

    it('is accessible', async () => {
        const { container } = render(
            <Dropdown label="Test">
                {mockOptions.map((option) => (
                    <MenuItem key={option.id} value={option}>
                        {option.label}
                    </MenuItem>
                ))}
            </Dropdown>,
        );

        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it('opens dropdown on Enter key', async () => {
        const user = userEvent.setup();
        const { getByRole } = render(
            <Dropdown label="Test">
                {mockOptions.map((option) => (
                    <MenuItem key={option.id} value={option}>
                        {option.label}
                    </MenuItem>
                ))}
            </Dropdown>,
        );
        const trigger = getByRole('combobox');
        await user.tab();
        expect(trigger).toHaveFocus();
        await user.keyboard('{Enter}');
        await waitFor(() => {
            expect(getByRole('listbox')).toBeInTheDocument();
        });
    });

    it('opens dropdown on Space key', async () => {
        const user = userEvent.setup();
        const { getByRole } = render(
            <Dropdown label="Test">
                {mockOptions.map((option) => (
                    <MenuItem key={option.id} value={option}>
                        {option.label}
                    </MenuItem>
                ))}
            </Dropdown>,
        );
        getByRole('combobox');
        await user.tab();
        await user.keyboard(' ');
        await waitFor(() => {
            expect(getByRole('listbox')).toBeInTheDocument();
        });
    });

    it('opens dropdown on ArrowUp key', async () => {
        const user = userEvent.setup();
        const { getByRole } = render(
            <Dropdown label="Test">
                {mockOptions.map((option) => (
                    <MenuItem key={option.id} value={option}>
                        {option.label}
                    </MenuItem>
                ))}
            </Dropdown>,
        );
        getByRole('combobox');
        await user.tab();
        await user.keyboard('{ArrowUp}');
        await waitFor(() => {
            expect(getByRole('listbox')).toBeInTheDocument();
        });
    });

    it('sets custom validity when errorText is provided', () => {
        const { getByRole, rerender } = render(
            <Dropdown label="Test">
                {mockOptions.map((option) => (
                    <MenuItem key={option.id} value={option}>
                        {option.label}
                    </MenuItem>
                ))}
            </Dropdown>,
        );
        const input = getByRole('combobox') as HTMLInputElement;

        expect(input.validationMessage).toBe('');

        rerender(
            <Dropdown label="Test" errorText="Invalid selection">
                {mockOptions.map((option) => (
                    <MenuItem key={option.id} value={option}>
                        {option.label}
                    </MenuItem>
                ))}
            </Dropdown>,
        );
        expect(input.validationMessage).toBe('Invalid selection');

        rerender(
            <Dropdown label="Test" errorText="">
                {mockOptions.map((option) => (
                    <MenuItem key={option.id} value={option}>
                        {option.label}
                    </MenuItem>
                ))}
            </Dropdown>,
        );
        expect(input.validationMessage).toBe('');
    });

    it('supports functional ref', () => {
        let refNode: HTMLInputElement | null = null;
        const functionalRef = (node: HTMLInputElement | null) => {
            refNode = node;
        };
        render(
            <Dropdown ref={functionalRef} label="Test">
                {mockOptions.map((option) => (
                    <MenuItem key={option.id} value={option}>
                        {option.label}
                    </MenuItem>
                ))}
            </Dropdown>,
        );

        expect(refNode).not.toBeNull();
        expect(refNode).toHaveProperty('tagName', 'INPUT');
    });

    it('supports useRef-style ref', () => {
        let capturedRef: HTMLInputElement | null = null;
        const TestComponent = () => {
            const ref = React.useRef<HTMLInputElement>(null);

            React.useEffect(() => {
                capturedRef = ref.current;
            }, []);

            return (
                <Dropdown ref={ref} label="Test">
                    {mockOptions.map((option) => (
                        <MenuItem key={option.id} value={option}>
                            {option.label}
                        </MenuItem>
                    ))}
                </Dropdown>
            );
        };
        render(<TestComponent />);
        expect(capturedRef).not.toBeNull();
        expect(capturedRef).toHaveProperty('tagName', 'INPUT');
    });

    it('prevents default behavior for non-navigation keys', () => {
        const { getByRole } = render(
            <Dropdown label="Test">
                {mockOptions.map((option) => (
                    <MenuItem key={option.id} value={option}>
                        {option.label}
                    </MenuItem>
                ))}
            </Dropdown>,
        );
        const trigger = getByRole('combobox');
        const event = fireEvent.keyDown(trigger, { key: 'a' });
        expect(event).toBe(false); // fireEvent returns false if preventDefault was called
    });

    it('does not prevent default for Tab key', () => {
        const { getByRole } = render(
            <Dropdown label="Test">
                {mockOptions.map((option) => (
                    <MenuItem key={option.id} value={option}>
                        {option.label}
                    </MenuItem>
                ))}
            </Dropdown>,
        );
        const trigger = getByRole('combobox');
        const event = fireEvent.keyDown(trigger, { key: 'Tab' });
        expect(event).toBe(true);
    });
});
