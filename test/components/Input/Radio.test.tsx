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
});
