import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ChipInput } from '../../../src/components/ChipInput';

expect.extend(toHaveNoViolations);

describe('ChipInput', () => {
    it('renders with initial value', () => {
        const { getByText } = render(<ChipInput label="Skills" value={['React', 'TypeScript']} />);
        expect(getByText('React')).toBeInTheDocument();
        expect(getByText('TypeScript')).toBeInTheDocument();
    });

    it('adds chip on Enter key press', async () => {
        const user = userEvent.setup();
        const handleChange = jest.fn();
        const { getByRole } = render(<ChipInput label="Skills" onChange={handleChange} />);
        const input = getByRole('textbox');
        await user.type(input, 'JavaScript{enter}');
        expect(handleChange).toHaveBeenCalledWith(['JavaScript']);
    });

    it('does not add empty chip', async () => {
        const user = userEvent.setup();
        const handleChange = jest.fn();
        const { getByRole } = render(<ChipInput label="Skills" onChange={handleChange} />);
        const input = getByRole('textbox');
        await user.type(input, '   {enter}');
        expect(handleChange).not.toHaveBeenCalled();
    });

    it('removes chip on close button click', () => {
        const handleChange = jest.fn();
        const { getByLabelText } = render(
            <ChipInput label="Skills" value={['React', 'TypeScript']} onChange={handleChange} />,
        );
        const closeButton = getByLabelText('Remove React');
        fireEvent.click(closeButton);
        expect(handleChange).toHaveBeenCalledWith(['TypeScript']);
    });

    it('updates value when prop changes', () => {
        const { rerender, getByText } = render(<ChipInput label="Skills" value={['React']} />);
        expect(getByText('React')).toBeInTheDocument();
        rerender(<ChipInput label="Skills" value={['TypeScript']} />);
        expect(getByText('TypeScript')).toBeInTheDocument();
    });

    it('handles required validation', () => {
        const { getByRole } = render(<ChipInput label="Skills" required />);
        const input = getByRole('textbox');
        expect(input).toHaveAttribute('aria-required', 'true');
        expect(input).toBeRequired();
    });

    it('displays error text', () => {
        const { getByText, getByRole } = render(
            <ChipInput label="Skills" errorText="At least one skill required" />,
        );
        expect(getByText('At least one skill required')).toBeInTheDocument();
        const input = getByRole('textbox');
        expect(input).toHaveAttribute('aria-invalid', 'true');
        expect(input).toHaveAttribute('aria-describedby');
    });

    it('forwards ref correctly', () => {
        const ref = React.createRef<HTMLInputElement>();
        render(<ChipInput label="Skills" ref={ref} />);
        expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it('validates input type on chip addition', async () => {
        const user = userEvent.setup();
        const handleChange = jest.fn();
        const { getByRole } = render(
            <ChipInput label="Emails" type="email" onChange={handleChange} />,
        );
        const input = getByRole('textbox');

        // Try to add invalid email
        await user.type(input, 'invalid-email{enter}');
        expect(handleChange).not.toHaveBeenCalled();

        // Add valid email
        await user.clear(input);
        await user.type(input, 'test@example.com{enter}');
        expect(handleChange).toHaveBeenCalledWith(['test@example.com']);
    });

    it('announces chip additions and removals', async () => {
        const user = userEvent.setup();
        const handleChange = jest.fn();
        const { getByRole, getByLabelText } = render(
            <ChipInput label="Skills" onChange={handleChange} />,
        );
        const input = getByRole('textbox');

        // Add a chip and check announcement
        await user.type(input, 'JavaScript{enter}');
        expect(handleChange).toHaveBeenCalledWith(['JavaScript']);

        // Check that the announcement was made (screen reader text)
        // Note: The announcement is in a visually hidden element with aria-live
        const liveRegion = document.querySelector('[aria-live="polite"]:not([role="status"])');
        expect(liveRegion).toHaveTextContent('JavaScript was added');

        // Remove the chip and check announcement
        const closeButton = getByLabelText('Remove JavaScript');
        fireEvent.click(closeButton);
        expect(handleChange).toHaveBeenCalledWith([]);

        // Check removal announcement
        expect(liveRegion).toHaveTextContent('JavaScript was removed');
    });

    it('uses custom announcement templates', async () => {
        const user = userEvent.setup();
        const handleChange = jest.fn();
        const { getByRole, getByLabelText } = render(
            <ChipInput
                label="Skills"
                onChange={handleChange}
                addedAnnouncementTemplate="Added {:label} to skills"
                removedAnnouncementTemplate="Removed {:label} from skills"
            />,
        );
        const input = getByRole('textbox');

        // Add a chip with custom template
        await user.type(input, 'React{enter}');
        expect(handleChange).toHaveBeenCalledWith(['React']);

        const liveRegion = document.querySelector('[aria-live="polite"]:not([role="status"])');
        expect(liveRegion).toHaveTextContent('Added React to skills');

        // Remove the chip with custom template
        const closeButton = getByLabelText('Remove React');
        fireEvent.click(closeButton);
        expect(handleChange).toHaveBeenCalledWith([]);

        expect(liveRegion).toHaveTextContent('Removed React from skills');
    });

    it('is accessible', async () => {
        const { container } = render(
            <ChipInput label="Skills" value={['React']} required errorText="Error" />,
        );
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it('sets custom validity when errorText is provided', () => {
        const { getByRole, rerender } = render(<ChipInput label="Skills" />);
        const input = getByRole('textbox') as HTMLInputElement;

        expect(input.validationMessage).toBe('');

        rerender(<ChipInput label="Skills" errorText="Invalid chips" />);
        expect(input.validationMessage).toBe('Invalid chips');

        rerender(<ChipInput label="Skills" errorText="" />);
        expect(input.validationMessage).toBe('');
    });

    describe('Form submission behavior', () => {
        it('prevents form submission when adding a chip with Enter', async () => {
            const user = userEvent.setup();
            const handleSubmit = jest.fn((e) => e.preventDefault());
            const handleChange = jest.fn();

            const { getByRole } = render(
                <form onSubmit={handleSubmit}>
                    <ChipInput label="Skills" onChange={handleChange} />
                </form>,
            );

            const input = getByRole('textbox');
            await user.type(input, 'React{enter}');

            // Chip should be added
            expect(handleChange).toHaveBeenCalledWith(['React']);
            // Form should NOT be submitted
            expect(handleSubmit).not.toHaveBeenCalled();
        });

        it('allows form submission when pressing Enter with empty input', async () => {
            const user = userEvent.setup();
            const handleSubmit = jest.fn((e) => e.preventDefault());
            const handleChange = jest.fn();

            const { getByRole } = render(
                <form onSubmit={handleSubmit}>
                    <ChipInput label="Skills" value={['React']} onChange={handleChange} />
                </form>,
            );

            const input = getByRole('textbox');
            await user.click(input);
            await user.keyboard('{enter}');

            // No chip should be added
            expect(handleChange).not.toHaveBeenCalled();
            // Form SHOULD be submitted
            expect(handleSubmit).toHaveBeenCalled();
        });

        it('prevents form submission when adding chip even with errorText', async () => {
            const user = userEvent.setup();
            const handleSubmit = jest.fn((e) => e.preventDefault());
            const handleChange = jest.fn();

            const { getByRole } = render(
                <form onSubmit={handleSubmit}>
                    <ChipInput
                        label="Skills"
                        onChange={handleChange}
                        errorText="At least 3 skills required"
                    />
                </form>,
            );

            const input = getByRole('textbox');
            await user.type(input, 'React{enter}');

            // Chip should still be added despite errorText
            expect(handleChange).toHaveBeenCalledWith(['React']);
            // Form should NOT be submitted
            expect(handleSubmit).not.toHaveBeenCalled();
        });

        it('does not submit form when chip close button is clicked', () => {
            const handleSubmit = jest.fn((e) => e.preventDefault());
            const handleChange = jest.fn();

            const { getByLabelText } = render(
                <form onSubmit={handleSubmit}>
                    <ChipInput
                        label="Skills"
                        value={['React', 'TypeScript']}
                        onChange={handleChange}
                    />
                </form>,
            );

            const closeButton = getByLabelText('Remove React');
            fireEvent.click(closeButton);

            // Chip should be removed
            expect(handleChange).toHaveBeenCalledWith(['TypeScript']);
            // Form should NOT be submitted
            expect(handleSubmit).not.toHaveBeenCalled();
        });

        it('prevents form submission when Enter is pressed with invalid input', async () => {
            const user = userEvent.setup();
            const handleSubmit = jest.fn((e) => e.preventDefault());
            const handleChange = jest.fn();

            const { getByRole } = render(
                <form onSubmit={handleSubmit}>
                    <ChipInput label="Emails" type="email" onChange={handleChange} />
                </form>,
            );

            const input = getByRole('textbox');
            await user.type(input, 'invalid-email{enter}');

            // Chip should NOT be added (invalid email)
            expect(handleChange).not.toHaveBeenCalled();
            // Form SHOULD be submitted (no valid text to add)
            expect(handleSubmit).toHaveBeenCalled();
        });

        it('maintains chip values after form submission', async () => {
            const user = userEvent.setup();
            const handleSubmit = jest.fn((e) => e.preventDefault());
            const { getByRole, getByText } = render(
                <form onSubmit={handleSubmit}>
                    <ChipInput label="Skills" value={['React', 'TypeScript']} />
                </form>,
            );

            const input = getByRole('textbox');
            await user.click(input);
            await user.keyboard('{enter}');

            // Form should be submitted
            expect(handleSubmit).toHaveBeenCalled();

            // Chips should still be visible
            expect(getByText('React')).toBeInTheDocument();
            expect(getByText('TypeScript')).toBeInTheDocument();
        });

        it('reorders chips on drag and drop', () => {
            const handleChange = jest.fn();
            const { getByText } = render(
                <ChipInput
                    label="Skills"
                    value={['React', 'TypeScript', 'Node.js']}
                    onChange={handleChange}
                />,
            );

            const reactChip = getByText('React').closest('[draggable="true"]');
            const typeScriptChip = getByText('TypeScript').closest('[draggable="true"]');

            if (!reactChip || !typeScriptChip) {
                throw new Error('Chips not found or not draggable');
            }

            // Simulate drag and drop
            fireEvent.dragStart(reactChip);
            fireEvent.dragOver(typeScriptChip);
            fireEvent.drop(typeScriptChip);

            // Assert that onChange was called with reordered chips
            expect(handleChange).toHaveBeenCalledWith(['TypeScript', 'React', 'Node.js']);
        });
    });
});
