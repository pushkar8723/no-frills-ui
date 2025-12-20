import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import {
    Accordion,
    AccordionStep,
    AccordionStepBody,
    AccordionStepFooter,
} from '../../../src/components/Accordion';

expect.extend(toHaveNoViolations);

describe('Accordion', () => {
    it('renders with multiple AccordionStep components', () => {
        const { getByText } = render(
            <Accordion>
                <AccordionStep header="Step 1">Content 1</AccordionStep>
                <AccordionStep header="Step 2">Content 2</AccordionStep>
            </Accordion>,
        );
        expect(getByText('Step 1')).toBeInTheDocument();
        expect(getByText('Step 2')).toBeInTheDocument();
    });

    it('AccordionStep renders with header prop', () => {
        const { getByText } = render(<AccordionStep header="Test Header">Content</AccordionStep>);
        expect(getByText('Test Header')).toBeInTheDocument();
    });

    it('AccordionStep completed state', () => {
        const { getByRole } = render(
            <AccordionStep header="Completed" completed>
                Content
            </AccordionStep>,
        );
        const button = getByRole('button');
        expect(button).toBeInTheDocument();
        // Check for completed styling or icon, assuming FiberManualRecord changes color
    });

    it('AccordionStep disabled state', () => {
        const { getByRole } = render(
            <AccordionStep header="Disabled" disabled>
                Content
            </AccordionStep>,
        );
        const button = getByRole('button');
        expect(button).toBeDisabled();
    });

    it('AccordionStep with errorText prop', () => {
        const { getByText } = render(
            <AccordionStep header="Error" errorText="Error message">
                Content
            </AccordionStep>,
        );
        expect(getByText('Error message')).toBeInTheDocument();
    });

    it('AccordionStep open/close state management', () => {
        const { getByRole, queryByText } = render(
            <Accordion>
                <AccordionStep header="Step 1">Content 1</AccordionStep>
            </Accordion>,
        );
        const button = getByRole('button');
        expect(queryByText('Content 1')).not.toBeInTheDocument();
        fireEvent.click(button);
        expect(getByRole('region')).toBeInTheDocument();
        expect(queryByText('Content 1')).toBeInTheDocument();
        fireEvent.click(button);
        expect(queryByText('Content 1')).not.toBeInTheDocument();
    });

    it('onStepClick event handler', () => {
        const handleClick = jest.fn();
        const { getByRole } = render(
            <Accordion onStepClick={handleClick}>
                <AccordionStep header="Step 1">Content 1</AccordionStep>
            </Accordion>,
        );
        const button = getByRole('button');
        fireEvent.click(button);
        expect(handleClick).toHaveBeenCalledWith(0);
    });

    it('AccordionStepBody and AccordionStepFooter subcomponents', () => {
        const { getByText } = render(
            <AccordionStep header="Step 1" open>
                <AccordionStepBody>Body Content</AccordionStepBody>
                <AccordionStepFooter>Footer Content</AccordionStepFooter>
            </AccordionStep>,
        );
        expect(getByText('Body Content')).toBeInTheDocument();
        expect(getByText('Footer Content')).toBeInTheDocument();
    });

    it('keyboard navigation (Tab to navigate, Enter/Space to toggle)', async () => {
        const user = userEvent.setup();
        const { getByRole } = render(
            <Accordion>
                <AccordionStep header="Step 1">Content 1</AccordionStep>
            </Accordion>,
        );
        const button = getByRole('button');
        await user.tab();
        expect(button).toHaveFocus();
        await user.keyboard('{Enter}');
        expect(getByRole('region')).toBeInTheDocument();
        await user.keyboard('{Enter}');
        expect(screen.queryByRole('region')).not.toBeInTheDocument();
    });

    it('ARIA attributes: aria-expanded, aria-controls, role="region", aria-labelledby', () => {
        const { getByRole } = render(
            <Accordion active={0}>
                <AccordionStep header="Step 1">Content 1</AccordionStep>
            </Accordion>,
        );
        const button = getByRole('button');
        const region = getByRole('region');
        expect(button).toHaveAttribute('aria-expanded', 'true');
        expect(button).toHaveAttribute('aria-controls');
        expect(region).toHaveAttribute('aria-labelledby');
        expect(region).toHaveAttribute('aria-hidden', 'false');
    });

    it('focus indicators and visual states', () => {
        // This might require visual testing or checking styles, but for now, check focus
        const { getByRole } = render(<AccordionStep header="Step 1">Content</AccordionStep>);
        const button = getByRole('button');
        button.focus();
        expect(button).toHaveFocus();
    });

    it('props forwarding to underlying Card component', () => {
        const { container } = render(
            <AccordionStep header="Step 1" data-testid="card">
                Content
            </AccordionStep>,
        );
        const card = container.querySelector('[data-testid="card"]');
        expect(card).toBeInTheDocument();
    });

    it('AccordionStep forwards ref correctly', () => {
        const ref = React.createRef<HTMLDivElement>();
        render(
            <AccordionStep ref={ref} header="Step 1">
                Content
            </AccordionStep>,
        );
        expect(ref.current).toBeInTheDocument();
        expect(ref.current?.tagName).toBe('DIV');
    });

    it('is accessible', async () => {
        const { container } = render(
            <Accordion>
                <AccordionStep header="Step 1">Content 1</AccordionStep>
                <AccordionStep header="Step 2">Content 2</AccordionStep>
            </Accordion>,
        );
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
