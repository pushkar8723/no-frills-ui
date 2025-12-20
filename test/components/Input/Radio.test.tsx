import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import Radio from '../../../src/components/Input/Radio';

expect.extend(toHaveNoViolations);

describe('Radio', () => {
    it('renders radio group', () => {
        const { getAllByRole } = render(
            <>
                <Radio label="Option 1" name="group" value="1" />
                <Radio label="Option 2" name="group" value="2" />
            </>,
        );
        const radios = getAllByRole('radio');
        expect(radios).toHaveLength(2);
    });

    it('checked state', () => {
        const { getByRole } = render(<Radio label="Test" defaultChecked />);
        const radio = getByRole('radio');
        expect(radio).toBeChecked();
    });

    it('disabled state', () => {
        const { getByRole } = render(<Radio label="Test" disabled />);
        const radio = getByRole('radio');
        expect(radio).toBeDisabled();
    });

    it('label prop', () => {
        const { getByText } = render(<Radio label="Test Label" />);
        expect(getByText('Test Label')).toBeInTheDocument();
    });

    it('onChange event', () => {
        const handleChange = jest.fn();
        const { getByRole } = render(<Radio label="Test" onChange={handleChange} />);
        const radio = getByRole('radio');
        fireEvent.click(radio);
        expect(handleChange).toHaveBeenCalled();
    });

    it('keyboard navigation', async () => {
        const user = userEvent.setup();
        const { getByRole } = render(<Radio label="Test" />);
        const radio = getByRole('radio');
        await user.tab();
        expect(radio).toHaveFocus();
    });

    it('ARIA attributes', () => {
        const { getByRole } = render(<Radio label="Test" />);
        const radio = getByRole('radio');
        // Radio has implicit role
        expect(radio).toHaveAttribute('type', 'radio');
    });

    // Grouping with fieldset/legend not implemented in component

    it('props forwarding to HTMLInputElement', () => {
        const { getByRole } = render(<Radio label="Test" data-testid="radio" name="test" />);
        const radio = getByRole('radio');
        expect(radio).toHaveAttribute('data-testid', 'radio');
        expect(radio).toHaveAttribute('name', 'test');
    });

    it('forwards ref correctly', () => {
        const ref = React.createRef<HTMLInputElement>();
        render(<Radio ref={ref} label="Test" />);
        expect(ref.current).toBeInTheDocument();
        expect(ref.current?.tagName).toBe('INPUT');
    });

    it('is accessible', async () => {
        const { container } = render(<Radio label="Test" />);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it('handles controlled value', () => {
        const handleChange = jest.fn();
        const { getByRole, rerender } = render(
            <Radio label="Test" checked={true} onChange={handleChange} />,
        );
        const radio = getByRole('radio');
        expect(radio).toBeChecked();

        rerender(<Radio label="Test" checked={false} onChange={handleChange} />);
        expect(radio).not.toBeChecked();
    });

    it('handles defaultChecked', () => {
        const { getByRole } = render(<Radio label="Test" defaultChecked />);
        const radio = getByRole('radio');
        expect(radio).toBeChecked();
    });

    it('handles value prop', () => {
        const { getByRole } = render(<Radio label="Test" value="test-value" />);
        const radio = getByRole('radio');
        expect(radio).toHaveAttribute('value', 'test-value');
    });

    it('handles name prop for grouping', () => {
        const { getAllByRole } = render(
            <>
                <Radio label="Option 1" name="test-group" value="1" />
                <Radio label="Option 2" name="test-group" value="2" />
                <Radio label="Option 3" name="different-group" value="3" />
            </>,
        );
        const radios = getAllByRole('radio');
        expect(radios[0]).toHaveAttribute('name', 'test-group');
        expect(radios[1]).toHaveAttribute('name', 'test-group');
        expect(radios[2]).toHaveAttribute('name', 'different-group');
    });

    it('handles required prop', () => {
        const { getByRole } = render(<Radio label="Test" required />);
        const radio = getByRole('radio');
        expect(radio).toHaveAttribute('required');
    });

    it('handles form integration', () => {
        const { getByRole } = render(
            <form>
                <Radio label="Test" name="radio-group" value="test" />
            </form>,
        );
        const radio = getByRole('radio');
        expect(radio).toHaveAttribute('name', 'radio-group');
        expect(radio).toHaveAttribute('value', 'test');
    });

    it('supports custom className and style', () => {
        const { getByRole } = render(
            <Radio label="Test" className="custom-radio" style={{ margin: '10px' }} />,
        );
        const radio = getByRole('radio');
        expect(radio).toHaveClass('custom-radio');
        expect(radio).toHaveStyle({ margin: '10px' });
    });

    it('handles onChange with correct event', () => {
        const handleChange = jest.fn();
        const { getByRole } = render(
            <Radio label="Test" checked={false} onChange={handleChange} />,
        );
        const radio = getByRole('radio');

        fireEvent.click(radio);

        expect(handleChange).toHaveBeenCalledTimes(1);
        const event = handleChange.mock.calls[0][0];
        expect(event).toBeInstanceOf(Object); // React synthetic event
        expect(event.target).toBe(radio);
    });

    it.skip('prevents state change when disabled', () => {
        const handleChange = jest.fn();
        const { getByRole } = render(<Radio label="Test" disabled onChange={handleChange} />);
        const radio = getByRole('radio');

        // Initially should not be checked
        expect(radio).not.toBeChecked();

        fireEvent.click(radio);

        // Should still not be checked after click
        expect(radio).not.toBeChecked();
    });

    it('handles multiple radio buttons in group correctly', () => {
        const handleChange1 = jest.fn();
        const handleChange2 = jest.fn();

        const { getAllByRole, rerender } = render(
            <>
                <Radio label="Option 1" name="group" value="1" onChange={handleChange1} />
                <Radio label="Option 2" name="group" value="2" onChange={handleChange2} />
            </>,
        );

        const radios = getAllByRole('radio');

        // Initially neither should be checked
        expect(radios[0]).not.toBeChecked();
        expect(radios[1]).not.toBeChecked();

        // Check first radio
        fireEvent.click(radios[0]);
        expect(handleChange1).toHaveBeenCalled();

        // Re-render with first radio checked
        rerender(
            <>
                <Radio label="Option 1" name="group" value="1" checked onChange={handleChange1} />
                <Radio label="Option 2" name="group" value="2" onChange={handleChange2} />
            </>,
        );

        expect(radios[0]).toBeChecked();
        expect(radios[1]).not.toBeChecked();
    });
});
