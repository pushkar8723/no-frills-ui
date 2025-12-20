import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Select } from '../../../src/components/Input';

expect.extend(toHaveNoViolations);

describe('Select', () => {
    it('renders options', () => {
        const { getByRole } = render(
            <Select label="Test">
                <option value="1">Option 1</option>
                <option value="2">Option 2</option>
            </Select>,
        );
        const select = getByRole('combobox');
        expect(select).toBeInTheDocument();
        expect(select.children).toHaveLength(3); // empty + 2 options
    });

    it('selected value', () => {
        const { getByRole } = render(
            <Select label="Test" value="2">
                <option value="1">Option 1</option>
                <option value="2">Option 2</option>
            </Select>,
        );
        const select = getByRole('combobox') as HTMLSelectElement;
        expect(select.value).toBe('2');
    });

    it('disabled state', () => {
        const { getByRole } = render(
            <Select label="Test" disabled>
                <option value="1">Option 1</option>
            </Select>,
        );
        const select = getByRole('combobox');
        expect(select).toBeDisabled();
    });

    it('onChange event', () => {
        const handleChange = jest.fn();
        const { getByRole } = render(
            <Select label="Test" onChange={handleChange}>
                <option value="1">Option 1</option>
                <option value="2">Option 2</option>
            </Select>,
        );
        const select = getByRole('combobox');
        fireEvent.change(select, { target: { value: '2' } });
        expect(handleChange).toHaveBeenCalled();
    });

    it('keyboard navigation', async () => {
        const user = userEvent.setup();
        const { getByRole } = render(
            <Select label="Test">
                <option value="1">Option 1</option>
            </Select>,
        );
        const select = getByRole('combobox');
        await user.tab();
        expect(select).toHaveFocus();
    });

    it('ARIA attributes for validation and required', () => {
        const { getByRole } = render(
            <Select label="Test" required errorText="Error">
                <option value="1">Option 1</option>
                <option value="2">Option 2</option>
            </Select>,
        );
        const select = getByRole('combobox');
        expect(select).toHaveAttribute('aria-required', 'true');
        expect(select).toHaveAttribute('aria-invalid', 'true');
        expect(select).toHaveAttribute('aria-describedby');
    });

    it('props forwarding to HTMLSelectElement', () => {
        const { getByRole } = render(
            <Select label="Test" data-testid="select" name="test">
                <option value="1">Option 1</option>
            </Select>,
        );
        const select = getByRole('combobox');
        expect(select).toHaveAttribute('data-testid', 'select');
        expect(select).toHaveAttribute('name', 'test');
    });

    it('forwards ref correctly', () => {
        const ref = React.createRef<HTMLSelectElement>();
        render(
            <Select ref={ref} label="Test">
                <option value="1">Option 1</option>
            </Select>,
        );
        expect(ref.current).toBeInTheDocument();
        expect(ref.current?.tagName).toBe('SELECT');
    });

    it('is accessible', async () => {
        const { container } = render(
            <Select label="Test">
                <option value="1">Option 1</option>
                <option value="2">Option 2</option>
            </Select>,
        );
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
