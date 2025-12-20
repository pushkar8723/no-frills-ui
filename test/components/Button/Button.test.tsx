import '@testing-library/jest-dom';
import React from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import Button from '../../../src/components/Button/Button';

expect.extend(toHaveNoViolations);

describe('Button', () => {
    it('renders correctly', () => {
        const { getByRole } = render(<Button>Click me</Button>);
        expect(getByRole('button', { name: /click me/i })).toBeInTheDocument();
    });

    it('is accessible', async () => {
        const { container } = render(<Button>Click me</Button>);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it('forwards ref correctly', () => {
        const ref = React.createRef<HTMLButtonElement>();
        render(<Button ref={ref}>Click me</Button>);
        expect(ref.current).toBeInTheDocument();
        expect(ref.current?.tagName).toBe('BUTTON');
    });

    it('handles click events', () => {
        const handleClick = jest.fn();
        const { getByRole } = render(<Button onClick={handleClick}>Click me</Button>);
        const button = getByRole('button');
        button.click();
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('handles disabled state', () => {
        const handleClick = jest.fn();
        const { getByRole } = render(
            <Button disabled onClick={handleClick}>
                Disabled
            </Button>,
        );
        const button = getByRole('button');
        expect(button).toBeDisabled();
        button.click();
        expect(handleClick).not.toHaveBeenCalled();
    });
});
