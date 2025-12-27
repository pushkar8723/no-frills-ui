import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Checkbox } from '../../../src/components/Input';

expect.extend(toHaveNoViolations);

describe('Checkbox', () => {
    it('renders checked/unchecked states', () => {
        const { rerender, getByRole } = render(<Checkbox label="Test" />);
        const input = getByRole('checkbox') as HTMLInputElement;
        expect(input).not.toBeChecked();

        rerender(<Checkbox label="Test" checked />);
        expect(input).toBeChecked();
    });

    it('indeterminate state', () => {
        const { getByRole } = render(<Checkbox label="Test" indeterminate />);
        const input = getByRole('checkbox') as HTMLInputElement;
        expect(input.indeterminate).toBe(true);
        expect(input).toHaveAttribute('aria-checked', 'mixed');
    });

    it('disabled state', () => {
        const { getByRole } = render(<Checkbox label="Test" disabled />);
        const input = getByRole('checkbox') as HTMLInputElement;
        expect(input).toBeDisabled();
    });

    it('label prop', () => {
        const { getByText } = render(<Checkbox label="Test Label" />);
        expect(getByText('Test Label')).toBeInTheDocument();
    });

    it('onChange event', () => {
        const handleChange = jest.fn();
        const { getByRole } = render(<Checkbox label="Test" onChange={handleChange} />);
        const input = getByRole('checkbox');
        fireEvent.click(input);
        expect(handleChange).toHaveBeenCalled();
    });

    it('keyboard navigation (Space to toggle)', async () => {
        const user = userEvent.setup();
        const { getByRole } = render(<Checkbox label="Test" />);
        const input = getByRole('checkbox') as HTMLInputElement;
        input.focus();
        await user.keyboard(' ');
        expect(input).toBeChecked();
    });

    it('ARIA attributes: aria-checked="mixed" for indeterminate', () => {
        const { getByRole } = render(<Checkbox label="Test" indeterminate />);
        const input = getByRole('checkbox');
        expect(input).toHaveAttribute('aria-checked', 'mixed');
    });

    it('props forwarding to HTMLInputElement', () => {
        const { getByRole } = render(<Checkbox label="Test" data-testid="checkbox" name="test" />);
        const input = getByRole('checkbox');
        expect(input).toHaveAttribute('data-testid', 'checkbox');
        expect(input).toHaveAttribute('name', 'test');
    });

    it('forwards ref correctly', () => {
        const ref = React.createRef<HTMLInputElement>();
        render(<Checkbox ref={ref} label="Test" />);
        expect(ref.current).toBeInTheDocument();
        expect(ref.current?.tagName).toBe('INPUT');
    });

    it('is accessible', async () => {
        const { container } = render(<Checkbox label="Test" />);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it('renders errorText and sets custom validity', () => {
        const { getByText, getByRole, rerender } = render(<Checkbox label="Test" />);
        const input = getByRole('checkbox') as HTMLInputElement;

        expect(input.validationMessage).toBe('');

        rerender(<Checkbox label="Test" errorText="Invalid selection" />);
        expect(getByText('Invalid selection')).toBeInTheDocument();
        expect(input).toHaveAttribute('aria-invalid', 'true');
        expect(input.validationMessage).toBe('Invalid selection');

        rerender(<Checkbox label="Test" errorText="" />);
        expect(input).toHaveAttribute('aria-invalid', 'false');
        expect(input.validationMessage).toBe('');
    });
});
