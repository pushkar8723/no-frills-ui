import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from '../../../src/components/Button';
import { Group, GroupLabel } from '../../../src/components/Groups';
import { Input } from '../../../src/components/Input';

expect.extend(toHaveNoViolations);

describe('Group', () => {
    it('renders children correctly', () => {
        render(
            <Group>
                <GroupLabel>Label</GroupLabel>
                <Input label="Test Input" />
                <Button>Action</Button>
            </Group>,
        );

        expect(screen.getByText('Label')).toBeInTheDocument();
        expect(screen.getByLabelText('Test Input')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
    });

    it('renders errorText and applies ARIA attributes', () => {
        const errorText = 'This is an error';
        render(
            <Group errorText={errorText}>
                <Input label="Test Input" />
            </Group>,
        );

        const errorElement = screen.getByText(errorText);
        expect(errorElement).toBeInTheDocument();

        // The container should have aria-describedby pointing to the error message
        // Since Container is a div, we check for aria-describedby on the div that contains children
        const groupContainer = errorElement.previousElementSibling;
        expect(groupContainer).toHaveAttribute('aria-describedby', errorElement.id);
    });

    it('forwards ref to the container', () => {
        const ref = React.createRef<HTMLDivElement>();
        render(
            <Group ref={ref}>
                <Button>Action</Button>
            </Group>,
        );

        expect(ref.current).toBeInTheDocument();
        expect(ref.current?.tagName).toBe('DIV');
    });

    it('supports interaction with grouped components', () => {
        const onClick = jest.fn();
        const onChange = jest.fn();

        render(
            <Group>
                <Input
                    label="Test Input"
                    onChange={(e) => onChange((e.target as HTMLInputElement).value)}
                />
                <Button onClick={onClick}>Click Me</Button>
            </Group>,
        );

        const input = screen.getByLabelText('Test Input');
        const button = screen.getByRole('button', { name: 'Click Me' });

        fireEvent.change(input, { target: { value: 'New Value' } });
        expect(onChange).toHaveBeenCalledWith('New Value');

        fireEvent.click(button);
        expect(onClick).toHaveBeenCalled();
    });

    it('is accessible', async () => {
        const { container } = render(
            <Group>
                <GroupLabel htmlFor="grouped-input">Search</GroupLabel>
                <Input id="grouped-input" label="Search" />
                <Button>Go</Button>
            </Group>,
        );

        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it('renders with GroupLabel containing an icon', () => {
        const Icon = () => <svg data-testid="test-icon" />;
        render(
            <Group>
                <GroupLabel>
                    <Icon />
                </GroupLabel>
                <Input label="Icon Input" />
            </Group>,
        );

        expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });
});
