import '@testing-library/jest-dom';
import React from 'react';
import { render } from '@testing-library/react';
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
});
