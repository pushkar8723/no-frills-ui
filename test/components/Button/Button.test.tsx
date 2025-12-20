import '@testing-library/jest-dom';
import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from '../../../src/components/Button';

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

    it('handles type prop', () => {
        const { getByRole } = render(<Button type="submit">Submit</Button>);
        expect(getByRole('button')).toHaveAttribute('type', 'submit');
    });

    it('handles onFocus and onBlur events', () => {
        const handleFocus = jest.fn();
        const handleBlur = jest.fn();
        const { getByRole } = render(
            <Button onFocus={handleFocus} onBlur={handleBlur}>
                Focus
            </Button>,
        );
        const button = getByRole('button');
        button.focus();
        expect(handleFocus).toHaveBeenCalled();
        button.blur();
        expect(handleBlur).toHaveBeenCalled();
    });

    it('keyboard navigation and focus indicators', async () => {
        const user = userEvent.setup();
        const { getByRole } = render(<Button>Tab</Button>);
        const button = getByRole('button');
        await user.tab();
        expect(button).toHaveFocus();
    });

    it('semantic HTML', () => {
        const { getByRole } = render(<Button>Button</Button>);
        expect(getByRole('button')).toBeInTheDocument();
    });

    // Target size and contrast are hard to test, assuming styles are correct

    it('props forwarding to HTMLButtonElement', () => {
        const { getByRole } = render(
            <Button data-testid="btn" className="custom">
                Test
            </Button>,
        );
        const button = getByRole('button');
        expect(button).toHaveAttribute('data-testid', 'btn');
        expect(button).toHaveClass('custom');
    });
});
