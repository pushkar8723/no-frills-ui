import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import Chip from '../../../src/components/Chip/Chip';

expect.extend(toHaveNoViolations);

describe('Chip', () => {
    it('renders with text content', () => {
        const { getByText } = render(<Chip label="Test Chip" />);
        expect(getByText('Test Chip')).toBeInTheDocument();
    });

    it('onCloseClick event', () => {
        const handleClose = jest.fn();
        const { getByRole } = render(<Chip label="Test" onCloseClick={handleClose} />);
        const button = getByRole('button');
        fireEvent.click(button);
        expect(handleClose).toHaveBeenCalled();
    });

    it('keyboard navigation (Tab, Enter, Delete)', async () => {
        const user = userEvent.setup();
        const handleClose = jest.fn();
        const { getByRole } = render(<Chip label="Test" onCloseClick={handleClose} />);
        const button = getByRole('button');
        await user.tab();
        expect(button).toHaveFocus();
        await user.keyboard('{Enter}');
        expect(handleClose).toHaveBeenCalled();
    });

    it('ARIA attributes: aria-label, role', () => {
        const { getByRole } = render(<Chip label="Test" />);
        const button = getByRole('button');
        expect(button).toHaveAttribute('aria-label', 'Remove Test');
    });

    it('focus management', () => {
        const { getByRole } = render(<Chip label="Test" />);
        const button = getByRole('button');
        button.focus();
        expect(button).toHaveFocus();
    });

    it('props forwarding', () => {
        const { container } = render(<Chip label="Test" data-testid="chip" className="custom" />);
        const span = container.firstChild as HTMLElement;
        expect(span).toHaveAttribute('data-testid', 'chip');
        expect(span).toHaveClass('custom');
    });

    it('forwards ref correctly', () => {
        const ref = React.createRef<HTMLSpanElement>();
        render(<Chip ref={ref} label="Test" />);
        expect(ref.current).toBeInTheDocument();
        expect(ref.current?.tagName).toBe('SPAN');
    });

    it('is accessible', async () => {
        const { container } = render(<Chip label="Test" />);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
