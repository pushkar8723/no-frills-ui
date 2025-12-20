import '@testing-library/jest-dom';
import React from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { IconButton } from '../../../src/components/Button';

expect.extend(toHaveNoViolations);

describe('IconButton', () => {
    it('renders correctly', () => {
        const { getByRole } = render(<IconButton>Click me</IconButton>);
        expect(getByRole('button', { name: /click me/i })).toBeInTheDocument();
    });

    it('is accessible', async () => {
        const { container } = render(<IconButton>Click me</IconButton>);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it('forwards ref correctly', () => {
        const ref = React.createRef<HTMLButtonElement>();
        render(<IconButton ref={ref}>Click me</IconButton>);
        expect(ref.current).toBeInTheDocument();
        expect(ref.current?.tagName).toBe('BUTTON');
    });

    it('handles click events', () => {
        const handleClick = jest.fn();
        const { getByRole } = render(<IconButton onClick={handleClick}>Click me</IconButton>);
        const button = getByRole('button');
        button.click();
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});
