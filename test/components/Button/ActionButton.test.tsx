import '@testing-library/jest-dom';
import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ActionButton } from '../../../src/components/Button';

expect.extend(toHaveNoViolations);

describe('ActionButton', () => {
    it('renders correctly', () => {
        const { getByRole } = render(<ActionButton>Click me</ActionButton>);
        expect(getByRole('button', { name: /click me/i })).toBeInTheDocument();
    });

    it('is accessible', async () => {
        const { container } = render(<ActionButton>Click me</ActionButton>);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it('forwards ref correctly', () => {
        const ref = React.createRef<HTMLButtonElement>();
        render(<ActionButton ref={ref}>Click me</ActionButton>);
        expect(ref.current).toBeInTheDocument();
        expect(ref.current?.tagName).toBe('BUTTON');
    });

    it('handles click events', () => {
        const handleClick = jest.fn();
        const { getByRole } = render(<ActionButton onClick={handleClick}>Click me</ActionButton>);
        const button = getByRole('button');
        button.click();
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('handles disabled state', () => {
        const handleClick = jest.fn();
        const { getByRole } = render(
            <ActionButton disabled onClick={handleClick}>
                Disabled
            </ActionButton>,
        );
        const button = getByRole('button');
        expect(button).toBeDisabled();
        button.click();
        expect(handleClick).not.toHaveBeenCalled();
    });

    it('handles type prop', () => {
        const { getByRole } = render(<ActionButton type="submit">Submit</ActionButton>);
        expect(getByRole('button')).toHaveAttribute('type', 'submit');
    });

    it('handles onFocus and onBlur events', () => {
        const handleFocus = jest.fn();
        const handleBlur = jest.fn();
        const { getByRole } = render(
            <ActionButton onFocus={handleFocus} onBlur={handleBlur}>
                Focus
            </ActionButton>,
        );
        const button = getByRole('button');
        button.focus();
        expect(handleFocus).toHaveBeenCalled();
        button.blur();
        expect(handleBlur).toHaveBeenCalled();
    });

    it('keyboard navigation and focus indicators', async () => {
        const user = userEvent.setup();
        const { getByRole } = render(<ActionButton>Tab</ActionButton>);
        const button = getByRole('button');
        await user.tab();
        expect(button).toHaveFocus();
    });

    it('semantic HTML', () => {
        const { getByRole } = render(<ActionButton>Button</ActionButton>);
        expect(getByRole('button')).toBeInTheDocument();
    });

    // Target size and contrast are hard to test, assuming styles are correct

    it('props forwarding to HTMLButtonElement', () => {
        const { getByRole } = render(
            <ActionButton data-testid="btn" className="custom">
                Test
            </ActionButton>,
        );
        const button = getByRole('button');
        expect(button).toHaveAttribute('data-testid', 'btn');
        expect(button).toHaveClass('custom');
    });
});
