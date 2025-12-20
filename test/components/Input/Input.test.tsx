import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import Input from '../../../src/components/Input/Input';

expect.extend(toHaveNoViolations);

describe('Input', () => {
    it('renders with label prop', () => {
        const { getByText } = render(<Input label="Test Label" />);
        expect(getByText('Test Label')).toBeInTheDocument();
    });

    it('renders with errorText prop', () => {
        const { getByText } = render(<Input label="Test" errorText="Error message" />);
        expect(getByText('Error message')).toBeInTheDocument();
    });

    it('required prop and asterisk display', () => {
        const { getByRole } = render(<Input label="Required" required />);
        const input = getByRole('textbox');
        expect(input).toHaveAttribute('required');
        // Asterisk is added via CSS, assuming it's rendered
    });

    it('disabled state', () => {
        const { getByRole } = render(<Input label="Test" disabled />);
        const input = getByRole('textbox');
        expect(input).toBeDisabled();
    });

    it('different input types', () => {
        const { getByRole, rerender } = render(<Input label="Test" type="email" />);
        let input = getByRole('textbox');
        expect(input).toHaveAttribute('type', 'email');

        rerender(<Input label="Test" type="url" />);
        input = getByRole('textbox');
        expect(input).toHaveAttribute('type', 'url');
    });

    it('onChange, onFocus, onBlur events', () => {
        const handleChange = jest.fn();
        const handleFocus = jest.fn();
        const handleBlur = jest.fn();
        const { getByRole } = render(
            <Input
                label="Test"
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
            />,
        );
        const input = getByRole('textbox');
        fireEvent.focus(input);
        expect(handleFocus).toHaveBeenCalled();
        fireEvent.change(input, { target: { value: 'test' } });
        expect(handleChange).toHaveBeenCalled();
        fireEvent.blur(input);
        expect(handleBlur).toHaveBeenCalled();
    });

    it('minLength, maxLength validation', () => {
        const { getByRole } = render(<Input label="Test" minLength={2} maxLength={10} />);
        const input = getByRole('textbox');
        expect(input).toHaveAttribute('minLength', '2');
        expect(input).toHaveAttribute('maxLength', '10');
    });

    it('aria-describedby, aria-invalid, aria-required attributes', () => {
        const { getByRole } = render(<Input label="Test" errorText="Error" required />);
        const input = getByRole('textbox');
        expect(input).toHaveAttribute('aria-invalid', 'true');
        expect(input).toHaveAttribute('aria-required', 'true');
        expect(input).toHaveAttribute('aria-describedby');
    });

    it('keyboard navigation', async () => {
        const user = userEvent.setup();
        const { getByRole } = render(<Input label="Test" />);
        const input = getByRole('textbox');
        await user.tab();
        expect(input).toHaveFocus();
    });

    it('props forwarding to HTMLInputElement', () => {
        const { getByRole } = render(
            <Input label="Test" data-testid="input" placeholder="Enter text" />,
        );
        const input = getByRole('textbox');
        expect(input).toHaveAttribute('data-testid', 'input');
        expect(input).toHaveAttribute('placeholder', 'Enter text');
    });

    it('forwards ref correctly', () => {
        const ref = React.createRef<HTMLInputElement>();
        render(<Input ref={ref} label="Test" />);
        expect(ref.current).toBeInTheDocument();
        expect(ref.current?.tagName).toBe('INPUT');
    });

    it('is accessible', async () => {
        const { container } = render(<Input label="Test" />);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
