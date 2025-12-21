import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Spinner } from '../../../src/components/Spinner';

expect.extend(toHaveNoViolations);

describe('Spinner', () => {
    it('renders with default size', () => {
        const { getByRole } = render(<Spinner />);
        const spinner = getByRole('status');
        expect(spinner).toBeInTheDocument();
        expect(spinner).toHaveStyle('width: 30px; height: 30px;');
    });

    it('renders with custom size', () => {
        const { getByRole } = render(<Spinner size={50} />);
        const spinner = getByRole('status');
        expect(spinner).toHaveStyle('width: 50px; height: 50px;');
    });

    it('renders with custom label', () => {
        const { getByLabelText } = render(<Spinner label="Loading data" />);
        expect(getByLabelText('Loading data')).toBeInTheDocument();
    });

    it('has correct ARIA attributes', () => {
        const { getByRole } = render(<Spinner />);
        const spinner = getByRole('status');
        expect(spinner).toHaveAttribute('aria-live', 'polite');
        expect(spinner).toHaveAttribute('aria-busy', 'true');
        expect(spinner).toHaveAttribute('aria-label', 'Loading');
    });

    it('forwards ref correctly', () => {
        const ref = React.createRef<HTMLDivElement>();
        render(<Spinner ref={ref} />);
        expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('is accessible', async () => {
        const { container } = render(<Spinner />);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it('renders with empty label', () => {
        const { getByRole } = render(<Spinner label="" />);
        const spinner = getByRole('status');
        expect(spinner).not.toHaveAttribute('aria-label');
    });
});
