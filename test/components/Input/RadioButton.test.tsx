import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { RadioButton, RadioGroup } from '../../../src/components/Input';

expect.extend(toHaveNoViolations);

describe('RadioButton', () => {
    it('renders with label', () => {
        const { getByText } = render(<RadioButton label="Option 1" />);
        expect(getByText('Option 1')).toBeInTheDocument();
    });

    it('checked state', () => {
        const { getByRole } = render(<RadioButton label="Test" defaultChecked />);
        const radio = getByRole('radio');
        expect(radio).toBeChecked();
    });

    it('disabled state', () => {
        const { getByRole } = render(<RadioButton label="Test" disabled />);
        const radio = getByRole('radio');
        expect(radio).toBeDisabled();
    });

    it('onChange event', () => {
        const handleChange = jest.fn();
        const { getByRole } = render(<RadioButton label="Test" onChange={handleChange} />);
        const radio = getByRole('radio');
        fireEvent.click(radio);
        expect(handleChange).toHaveBeenCalled();
    });

    it('forwards ref correctly', () => {
        const ref = React.createRef<HTMLInputElement>();
        render(<RadioButton ref={ref} label="Test" />);
        expect(ref.current).toBeInTheDocument();
        expect(ref.current?.tagName).toBe('INPUT');
    });

    it('handles required prop', () => {
        const { getByRole } = render(<RadioButton label="Test" required />);
        const radio = getByRole('radio');
        expect(radio).toHaveAttribute('required');
    });

    it('handles value and name props', () => {
        const { getByRole } = render(<RadioButton label="Test" value="foo" name="bar" />);
        const radio = getByRole('radio');
        expect(radio).toHaveAttribute('value', 'foo');
        expect(radio).toHaveAttribute('name', 'bar');
    });

    it('renders inside RadioGroup', () => {
        const { getAllByRole } = render(
            <RadioGroup>
                <RadioButton label="A" name="group" value="a" />
                <RadioButton label="B" name="group" value="b" />
            </RadioGroup>,
        );
        const radios = getAllByRole('radio');
        expect(radios).toHaveLength(2);
    });

    it('is accessible', async () => {
        const { container } = render(<RadioButton label="Test" />);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it('keyboard navigation', async () => {
        const user = userEvent.setup();
        const { getByRole } = render(<RadioButton label="Test" />);
        const radio = getByRole('radio');
        await user.tab();
        expect(radio).toHaveFocus();
    });

    it('renders errorText and sets custom validity', () => {
        const { getByRole, rerender, queryByText } = render(<RadioButton label="Test" />);
        const radio = getByRole('radio') as HTMLInputElement;

        expect(radio.validationMessage).toBe('');

        rerender(<RadioButton label="Test" errorText="Invalid option" />);
        // Visual error text should NOT be rendered
        expect(queryByText('Invalid option')).not.toBeInTheDocument();
        // But invalid state and message should be set on input
        expect(radio).toHaveAttribute('aria-invalid', 'true');
        expect(radio.validationMessage).toBe('Invalid option');

        rerender(<RadioButton label="Test" errorText="" />);
        expect(radio).toHaveAttribute('aria-invalid', 'false');
        expect(radio.validationMessage).toBe('');
    });
});
