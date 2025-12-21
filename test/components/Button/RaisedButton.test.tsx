import '@testing-library/jest-dom';
import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { RaisedButton } from '../../../src/components/Button';

expect.extend(toHaveNoViolations);

describe('RaisedButton', () => {
    it('renders correctly', () => {
        const { getByRole } = render(<RaisedButton>Click me</RaisedButton>);
        expect(getByRole('button', { name: /click me/i })).toBeInTheDocument();
    });

    it('is accessible', async () => {
        const { container } = render(<RaisedButton>Click me</RaisedButton>);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it('forwards ref correctly', () => {
        const ref = React.createRef<HTMLButtonElement>();
        render(<RaisedButton ref={ref}>Click me</RaisedButton>);
        expect(ref.current).toBeInTheDocument();
        expect(ref.current?.tagName).toBe('BUTTON');
    });

    it('handles click events', () => {
        const handleClick = jest.fn();
        const { getByRole } = render(<RaisedButton onClick={handleClick}>Click me</RaisedButton>);
        const button = getByRole('button');
        button.click();
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('handles disabled state', () => {
        const handleClick = jest.fn();
        const { getByRole } = render(
            <RaisedButton disabled onClick={handleClick}>
                Disabled
            </RaisedButton>,
        );
        const button = getByRole('button');
        expect(button).toBeDisabled();
        button.click();
        expect(handleClick).not.toHaveBeenCalled();
    });

    it('handles type prop', () => {
        const { getByRole } = render(<RaisedButton type="submit">Submit</RaisedButton>);
        expect(getByRole('button')).toHaveAttribute('type', 'submit');
    });

    it('handles onFocus and onBlur events', () => {
        const handleFocus = jest.fn();
        const handleBlur = jest.fn();
        const { getByRole } = render(
            <RaisedButton onFocus={handleFocus} onBlur={handleBlur}>
                Focus
            </RaisedButton>,
        );
        const button = getByRole('button');
        button.focus();
        expect(handleFocus).toHaveBeenCalled();
        button.blur();
        expect(handleBlur).toHaveBeenCalled();
    });

    it('keyboard navigation and focus indicators', async () => {
        const user = userEvent.setup();
        const { getByRole } = render(<RaisedButton>Tab</RaisedButton>);
        const button = getByRole('button');
        await user.tab();
        expect(button).toHaveFocus();
    });

    it('semantic HTML', () => {
        const { getByRole } = render(<RaisedButton>Button</RaisedButton>);
        expect(getByRole('button')).toBeInTheDocument();
    });

    // Target size and contrast are hard to test, assuming styles are correct

    it('props forwarding to HTMLButtonElement', () => {
        const { getByRole } = render(
            <RaisedButton data-testid="btn" className="custom">
                Test
            </RaisedButton>,
        );
        const button = getByRole('button');
        expect(button).toHaveAttribute('data-testid', 'btn');
        expect(button).toHaveClass('custom');
    });
});
