import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Toggle } from '../../../src/components/Input';

expect.extend(toHaveNoViolations);

describe('Toggle', () => {
    it('renders unchecked by default', () => {
        const { getByRole } = render(<Toggle label="Test" />);
        const toggle = getByRole('switch');
        expect(toggle).not.toBeChecked();
    });

    it('renders checked when defaultChecked prop is true', () => {
        const { getByRole } = render(<Toggle label="Test" defaultChecked />);
        const toggle = getByRole('switch');
        expect(toggle).toBeChecked();
    });

    it('renders label', () => {
        const { getByText } = render(<Toggle label="Test Label" />);
        expect(getByText('Test Label')).toBeInTheDocument();
    });

    it('handles onChange event', () => {
        const handleChange = jest.fn();
        const { getByRole } = render(<Toggle label="Test" onChange={handleChange} />);
        const toggle = getByRole('switch');
        fireEvent.click(toggle);
        expect(handleChange).toHaveBeenCalled();
    });

    it('toggles checked state on click', async () => {
        const user = userEvent.setup();
        const { getByRole } = render(<Toggle label="Test" />);
        const toggle = getByRole('switch');
        expect(toggle).not.toBeChecked();
        await user.click(toggle);
        expect(toggle).toBeChecked();
    });

    it('is disabled when disabled prop is true', () => {
        const { getByRole } = render(<Toggle label="Test" disabled />);
        const toggle = getByRole('switch');
        expect(toggle).toBeDisabled();
    });

    it('forwards ref correctly', () => {
        const ref = React.createRef<HTMLInputElement>();
        render(<Toggle ref={ref} />);
        expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it('is accessible', async () => {
        const { container } = render(<Toggle label="Test" />);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
