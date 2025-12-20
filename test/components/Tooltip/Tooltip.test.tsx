import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Tooltip } from '../../../src/components';

expect.extend(toHaveNoViolations);

describe('Tooltip', () => {
    it('renders children', () => {
        const { getByText } = render(
            <Tooltip tooltipText="Help text">
                <button>Click me</button>
            </Tooltip>,
        );
        expect(getByText('Click me')).toBeInTheDocument();
    });

    it('renders tooltip text', () => {
        const { getByText } = render(
            <Tooltip tooltipText="Help text">
                <button>Click me</button>
            </Tooltip>,
        );
        const tooltip = getByText('Help text');
        expect(tooltip).toHaveAttribute('role', 'tooltip');
    });

    it('adds aria-describedby to child', () => {
        const { getByText } = render(
            <Tooltip tooltipText="Help text">
                <button>Click me</button>
            </Tooltip>,
        );
        const button = getByText('Click me');
        expect(button).toHaveAttribute('aria-describedby');
    });

    it('adds tabIndex to child if not present', () => {
        const { getByText } = render(
            <Tooltip tooltipText="Help text">
                <span>Click me</span>
            </Tooltip>,
        );
        const span = getByText('Click me');
        expect(span).toHaveAttribute('tabIndex', '0');
    });

    it('has correct ARIA attributes', () => {
        const { getByText } = render(
            <Tooltip tooltipText="Help text">
                <button>Click me</button>
            </Tooltip>,
        );
        const tooltip = getByText('Help text');
        expect(tooltip).toHaveAttribute('aria-hidden', 'true');
    });

    it('forwards ref correctly', () => {
        const ref = React.createRef<HTMLDivElement>();
        render(
            <Tooltip ref={ref} tooltipText="Help">
                <button>Click</button>
            </Tooltip>,
        );
        expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('is accessible', async () => {
        const { container } = render(
            <Tooltip tooltipText="Help text">
                <button>Click me</button>
            </Tooltip>,
        );
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
