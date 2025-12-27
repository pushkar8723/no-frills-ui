import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { TextArea } from '../../../src/components/Input';

expect.extend(toHaveNoViolations);

describe('TextArea', () => {
    it('renders with label', () => {
        const { getByText } = render(<TextArea label="Test Label" />);
        expect(getByText('Test Label')).toBeInTheDocument();
    });

    it('renders with errorText', () => {
        const { getByText } = render(<TextArea label="Test" errorText="Error message" />);
        expect(getByText('Error message')).toBeInTheDocument();
    });

    it('disabled state', () => {
        const { getByRole } = render(<TextArea label="Test" disabled />);
        const textarea = getByRole('textbox');
        expect(textarea).toBeDisabled();
    });

    it('onChange event', () => {
        const handleChange = jest.fn();
        const { getByRole } = render(<TextArea label="Test" onChange={handleChange} />);
        const textarea = getByRole('textbox');
        fireEvent.change(textarea, { target: { value: 'test' } });
        expect(handleChange).toHaveBeenCalled();
    });

    it('keyboard navigation', async () => {
        const user = userEvent.setup();
        const { getByRole } = render(<TextArea label="Test" />);
        const textarea = getByRole('textbox');
        await user.tab();
        expect(textarea).toHaveFocus();
    });

    it('ARIA attributes', () => {
        const { getByRole } = render(<TextArea label="Test" errorText="Error" required />);
        const textarea = getByRole('textbox');
        expect(textarea).toHaveAttribute('aria-invalid', 'true');
        expect(textarea).toHaveAttribute('aria-required', 'true');
        expect(textarea).toHaveAttribute('aria-describedby');
    });

    it('props forwarding to HTMLTextAreaElement', () => {
        const { getByRole } = render(
            <TextArea label="Test" data-testid="textarea" placeholder="Enter text" />,
        );
        const textarea = getByRole('textbox');
        expect(textarea).toHaveAttribute('data-testid', 'textarea');
        expect(textarea).toHaveAttribute('placeholder', 'Enter text');
    });

    it('forwards ref correctly', () => {
        const ref = React.createRef<HTMLTextAreaElement>();
        render(<TextArea ref={ref} label="Test" />);
        expect(ref.current).toBeInTheDocument();
        expect(ref.current?.tagName).toBe('TEXTAREA');
    });

    it('is accessible', async () => {
        const { container } = render(<TextArea label="Test" />);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it('handles focus event and calls onFocus prop', () => {
        const handleFocus = jest.fn();
        const { getByRole } = render(<TextArea label="Test" onFocus={handleFocus} />);
        const textarea = getByRole('textbox');
        fireEvent.focus(textarea);
        expect(handleFocus).toHaveBeenCalled();
    });

    it('updates value correctly even without onChange prop', () => {
        const { getByRole } = render(<TextArea label="Test" />);
        const textarea = getByRole('textbox') as HTMLTextAreaElement;
        fireEvent.change(textarea, { target: { value: 'new value' } });
        expect(textarea.value).toBe('new value');
    });

    it('updates internal value when propsValue changes', () => {
        const { getByRole, rerender } = render(<TextArea label="Test" value="initial" />);
        const textarea = getByRole('textbox') as HTMLTextAreaElement;
        expect(textarea.value).toBe('initial');

        rerender(<TextArea label="Test" value="updated" />);
        expect(textarea.value).toBe('updated');
    });

    it('sets custom validity when errorText is provided', () => {
        const { getByRole, rerender } = render(<TextArea label="Test" />);
        const textarea = getByRole('textbox') as HTMLTextAreaElement;

        expect(textarea.validationMessage).toBe('');

        rerender(<TextArea label="Test" errorText="Invalid text" />);
        expect(textarea.validationMessage).toBe('Invalid text');

        rerender(<TextArea label="Test" errorText="" />);
        expect(textarea.validationMessage).toBe('');
    });
});
