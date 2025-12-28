import '@testing-library/jest-dom';
import { render, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Stepper, Step } from '../../../src/components/Stepper';

expect.extend(toHaveNoViolations);

describe('Stepper', () => {
    it('renders steps', () => {
        const { getAllByText } = render(
            <Stepper>
                <Step name="Step 1">Content 1</Step>
                <Step name="Step 2">Content 2</Step>
            </Stepper>,
        );
        const stepTexts = getAllByText('Step 1');
        expect(stepTexts).toHaveLength(2); // One in tab button, one in mobile header
        expect(stepTexts[0]).toBeInTheDocument();
    });

    it('shows active step content', () => {
        const { getByText, queryByText } = render(
            <Stepper active={0}>
                <Step name="Step 1">Content 1</Step>
                <Step name="Step 2">Content 2</Step>
            </Stepper>,
        );
        expect(getByText('Content 1')).toBeInTheDocument();
        expect(queryByText('Content 2')).not.toBeInTheDocument();
    });

    it('navigates to next step by clicking step button', () => {
        const { getByText, getByRole } = render(
            <Stepper>
                <Step name="Step 1">Content 1</Step>
                <Step name="Step 2">Content 2</Step>
            </Stepper>,
        );

        const step2Button = getByRole('tab', { name: 'Step 2' });
        fireEvent.click(step2Button);

        expect(getByText('Content 2')).toBeInTheDocument();
    });

    it('navigates to previous step by clicking step button', () => {
        const { getByText, getByRole } = render(
            <Stepper active={1}>
                <Step name="Step 1">Content 1</Step>
                <Step name="Step 2">Content 2</Step>
            </Stepper>,
        );

        const step1Button = getByRole('tab', { name: 'Step 1' });
        fireEvent.click(step1Button);

        expect(getByText('Content 1')).toBeInTheDocument();
    });

    it('calls onStepClick', () => {
        const handleStepChange = jest.fn();
        const { getByRole } = render(
            <Stepper onStepClick={handleStepChange}>
                <Step name="Step 1">Content 1</Step>
                <Step name="Step 2">Content 2</Step>
            </Stepper>,
        );

        const step2Button = getByRole('tab', { name: 'Step 2' });
        fireEvent.click(step2Button);

        expect(handleStepChange).toHaveBeenCalledWith(1);
    });

    it('shows correct badge for active step', () => {
        const { getByRole } = render(
            <Stepper active={0}>
                <Step name="Step 1">Content 1</Step>
                <Step name="Step 2">Content 2</Step>
            </Stepper>,
        );

        const step1Button = getByRole('tab', { name: 'Step 1' });
        expect(step1Button).toHaveAttribute('aria-selected', 'true');
    });

    it('navigates focused step with arrow keys', () => {
        const { getByRole } = render(
            <Stepper>
                <Step name="Step 1">Content 1</Step>
                <Step name="Step 2">Content 2</Step>
                <Step name="Step 3">Content 3</Step>
            </Stepper>,
        );

        const step1Button = getByRole('tab', { name: 'Step 1' });
        const step2Button = getByRole('tab', { name: 'Step 2' });
        const step3Button = getByRole('tab', { name: 'Step 3' });

        step1Button.focus();
        expect(document.activeElement).toBe(step1Button);

        // ArrowRight
        fireEvent.keyDown(step1Button, { key: 'ArrowRight' });
        expect(document.activeElement).toBe(step2Button);

        // ArrowDown
        fireEvent.keyDown(step2Button, { key: 'ArrowDown' });
        expect(document.activeElement).toBe(step3Button);

        // Cyclic ArrowRight
        fireEvent.keyDown(step3Button, { key: 'ArrowRight' });
        expect(document.activeElement).toBe(step1Button);

        // ArrowLeft
        fireEvent.keyDown(step1Button, { key: 'ArrowLeft' });
        expect(document.activeElement).toBe(step3Button);

        // ArrowUp
        fireEvent.keyDown(step3Button, { key: 'ArrowUp' });
        expect(document.activeElement).toBe(step2Button);

        // Cyclic ArrowLeft
        fireEvent.keyDown(step2Button, { key: 'ArrowLeft' });
        expect(document.activeElement).toBe(step1Button);
    });

    it('is accessible', async () => {
        const { container } = render(
            <Stepper>
                <Step name="Step 1">Content 1</Step>
            </Stepper>,
        );
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
