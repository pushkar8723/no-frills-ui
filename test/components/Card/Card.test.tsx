import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Card, CardHeader, CardBody, CardFooter } from '../../../src/components/Card';

expect.extend(toHaveNoViolations);

describe('Card', () => {
    it('renders with and without elevated prop', () => {
        const { rerender, container } = render(<Card>Content</Card>);
        expect(container.firstChild).toBeInTheDocument();

        rerender(<Card elevated>Content</Card>);
        expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with children content', () => {
        const { getByText } = render(<Card>Test Content</Card>);
        expect(getByText('Test Content')).toBeInTheDocument();
    });

    it('CardHeader, CardBody, CardFooter subcomponents', () => {
        const { getByText } = render(
            <Card>
                <CardHeader>Header</CardHeader>
                <CardBody>Body</CardBody>
                <CardFooter>Footer</CardFooter>
            </Card>,
        );
        expect(getByText('Header')).toBeInTheDocument();
        expect(getByText('Body')).toBeInTheDocument();
        expect(getByText('Footer')).toBeInTheDocument();
    });

    it('props forwarding to div element', () => {
        const { container } = render(
            <Card data-testid="card" className="custom">
                Test
            </Card>,
        );
        const div = container.firstChild as HTMLElement;
        expect(div).toHaveAttribute('data-testid', 'card');
        expect(div).toHaveClass('custom');
    });

    it('ARIA attributes support', () => {
        const { container } = render(
            <Card role="region" aria-label="Card">
                Content
            </Card>,
        );
        const div = container.firstChild as HTMLElement;
        expect(div).toHaveAttribute('role', 'region');
        expect(div).toHaveAttribute('aria-label', 'Card');
    });

    it('semantic structure recommendations', () => {
        // Assuming semantic use
        const { container } = render(<Card>Content</Card>);
        expect((container.firstChild as Element)?.tagName).toBe('ARTICLE');
    });

    // Content contrast and scrollable keyboard navigation are hard to test

    it('forwards ref correctly', () => {
        const ref = React.createRef<HTMLElement>();
        render(<Card ref={ref}>Content</Card>);
        expect(ref.current).toBeInTheDocument();
        expect(ref.current?.tagName).toBe('ARTICLE');
    });

    it('is accessible', async () => {
        const { container } = render(
            <Card>
                <CardHeader>Header</CardHeader>
                <CardBody>Body</CardBody>
                <CardFooter>Footer</CardFooter>
            </Card>,
        );
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
