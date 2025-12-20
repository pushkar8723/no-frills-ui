import '@testing-library/jest-dom';
import React from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { LinkButton } from '../../../src/components/Button';

expect.extend(toHaveNoViolations);

describe('LinkButton', () => {
    it('renders correctly', () => {
        const { getByRole } = render(<LinkButton>Click me</LinkButton>);
        expect(getByRole('button', { name: /click me/i })).toBeInTheDocument();
    });

    it('is accessible', async () => {
        const { container } = render(<LinkButton>Click me</LinkButton>);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it('forwards ref correctly', () => {
        const ref = React.createRef<HTMLButtonElement>();
        render(<LinkButton ref={ref}>Click me</LinkButton>);
        expect(ref.current).toBeInTheDocument();
        expect(ref.current?.tagName).toBe('BUTTON');
    });

    it('handles click events', () => {
        const handleClick = jest.fn();
        const { getByRole } = render(<LinkButton onClick={handleClick}>Click me</LinkButton>);
        const button = getByRole('button');
        button.click();
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});
