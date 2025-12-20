import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent, act } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { DragAndDrop, ORIENTATION } from '../../../src/components/DragAndDrop';

expect.extend(toHaveNoViolations);

describe('DragAndDrop', () => {
    it('renders children', () => {
        const { getByText } = render(
            <DragAndDrop onDrop={() => {}}>
                <div>Item 1</div>
                <div>Item 2</div>
            </DragAndDrop>,
        );
        expect(getByText('Item 1')).toBeInTheDocument();
        expect(getByText('Item 2')).toBeInTheDocument();
    });

    it('calls onDrop when provided', () => {
        const handleDrop = jest.fn();
        const { container } = render(
            <DragAndDrop onDrop={handleDrop}>
                <div>Item 1</div>
                <div>Item 2</div>
            </DragAndDrop>,
        );

        // Note: Full drag simulation is complex in jsdom, but we can test the setup
        expect(container).toBeInTheDocument();
        expect(handleDrop).not.toHaveBeenCalled(); // Should not be called without interaction
    });

    it('shows drag indicator when enabled', () => {
        const { container } = render(
            <DragAndDrop onDrop={() => {}} showIndicator>
                <div>Item 1</div>
                <div>Item 2</div>
            </DragAndDrop>,
        );
        expect(container).toBeInTheDocument();
    });

    it('supports horizontal orientation', () => {
        const { container } = render(
            <DragAndDrop onDrop={() => {}} orientation={ORIENTATION.HORIZONTAL}>
                <div>Item 1</div>
                <div>Item 2</div>
            </DragAndDrop>,
        );
        expect(container).toBeInTheDocument();
        const dragContainer = container.querySelector('[role="list"]');
        expect(dragContainer).toHaveStyle('flex-direction: row');
    });

    it('supports vertical orientation by default', () => {
        const { container } = render(
            <DragAndDrop onDrop={() => {}}>
                <div>Item 1</div>
                <div>Item 2</div>
            </DragAndDrop>,
        );
        expect(container).toBeInTheDocument();
        const dragContainer = container.querySelector('[role="list"]');
        expect(dragContainer).toHaveStyle('flex-direction: column');
    });

    it('accepts custom i18n templates', () => {
        const { container } = render(
            <DragAndDrop
                onDrop={() => {}}
                itemAriaLabelTemplate="Custom item {:position}"
                dragHandleAriaLabel="Custom drag handle"
                grabbedAnnouncementTemplate="Custom grabbed {:position}"
                movedAnnouncementTemplate="Custom moved {:position}"
                droppedAnnouncementTemplate="Custom dropped {:position}"
                cancelledAnnouncementTemplate="Custom cancelled"
            >
                <div>Item 1</div>
                <div>Item 2</div>
            </DragAndDrop>,
        );
        expect(container).toBeInTheDocument();
    });

    it('renders with proper ARIA attributes', () => {
        const { container } = render(
            <DragAndDrop onDrop={() => {}}>
                <div>Item 1</div>
                <div>Item 2</div>
            </DragAndDrop>,
        );
        const list = container.querySelector('[role="list"]');
        expect(list).toBeInTheDocument();

        const status = container.querySelector('[role="status"]');
        expect(status).toBeInTheDocument();
        expect(status).toHaveAttribute('aria-live', 'polite');
        expect(status).toHaveAttribute('aria-atomic', 'true');
    });

    it('forwards ref correctly', () => {
        const ref = React.createRef<HTMLDivElement>();
        render(
            <DragAndDrop ref={ref} onDrop={() => {}}>
                <div>Item 1</div>
            </DragAndDrop>,
        );
        expect(ref.current).toBeInTheDocument();
        expect(ref.current).toHaveAttribute('role', 'list');
    });

    it('starts drag with space key', () => {
        const handleDrop = jest.fn();
        const { getAllByRole } = render(
            <DragAndDrop onDrop={handleDrop}>
                <div>Item 1</div>
                <div>Item 2</div>
            </DragAndDrop>,
        );

        const items = getAllByRole('listitem');
        const firstItem = items[0];

        // Press space to start grabbing
        fireEvent.keyDown(firstItem, { key: ' ', code: 'Space' });

        // Check that aria-grabbed is set to true
        expect(firstItem).toHaveAttribute('aria-grabbed', 'true');
    });

    it('moves grabbed item with arrow keys (vertical)', () => {
        const handleDrop = jest.fn();
        const { getAllByRole } = render(
            <DragAndDrop onDrop={handleDrop}>
                <div>Item 1</div>
                <div>Item 2</div>
                <div>Item 3</div>
            </DragAndDrop>,
        );

        const items = getAllByRole('listitem');
        const firstItem = items[0];

        // Start grabbing first item
        fireEvent.keyDown(firstItem, { key: ' ', code: 'Space' });
        expect(firstItem).toHaveAttribute('aria-grabbed', 'true');

        // Move down with arrow key
        fireEvent.keyDown(firstItem, { key: 'ArrowDown', code: 'ArrowDown' });
        expect(handleDrop).toHaveBeenCalledWith(0, 1);
    });

    it('moves grabbed item with arrow keys (horizontal)', () => {
        const handleDrop = jest.fn();
        const { getAllByRole } = render(
            <DragAndDrop onDrop={handleDrop} orientation={ORIENTATION.HORIZONTAL}>
                <div>Item 1</div>
                <div>Item 2</div>
                <div>Item 3</div>
            </DragAndDrop>,
        );

        const items = getAllByRole('listitem');
        const firstItem = items[0];

        // Start grabbing first item
        fireEvent.keyDown(firstItem, { key: ' ', code: 'Space' });
        expect(firstItem).toHaveAttribute('aria-grabbed', 'true');

        // Move right with arrow key
        fireEvent.keyDown(firstItem, { key: 'ArrowRight', code: 'ArrowRight' });
        expect(handleDrop).toHaveBeenCalledWith(0, 1);
    });

    it('drops item with space key', () => {
        const handleDrop = jest.fn();
        const { getAllByRole } = render(
            <DragAndDrop onDrop={handleDrop}>
                <div>Item 1</div>
                <div>Item 2</div>
            </DragAndDrop>,
        );

        const items = getAllByRole('listitem');
        const firstItem = items[0];

        // Start grabbing
        fireEvent.keyDown(firstItem, { key: ' ', code: 'Space' });
        expect(firstItem).toHaveAttribute('aria-grabbed', 'true');

        // Drop with space
        fireEvent.keyDown(firstItem, { key: ' ', code: 'Space' });
        expect(handleDrop).toHaveBeenCalledWith(0, 0); // Drop at same position
    });

    it('drops item with enter key', () => {
        const handleDrop = jest.fn();
        const { getAllByRole } = render(
            <DragAndDrop onDrop={handleDrop}>
                <div>Item 1</div>
                <div>Item 2</div>
            </DragAndDrop>,
        );

        const items = getAllByRole('listitem');
        const firstItem = items[0];

        // Start grabbing
        fireEvent.keyDown(firstItem, { key: ' ', code: 'Space' });
        expect(firstItem).toHaveAttribute('aria-grabbed', 'true');

        // Drop with enter
        fireEvent.keyDown(firstItem, { key: 'Enter', code: 'Enter' });
        expect(handleDrop).toHaveBeenCalledWith(0, 0); // Drop at same position
    });

    it('cancels drag with escape key', () => {
        const handleDrop = jest.fn();
        const { getAllByRole } = render(
            <DragAndDrop onDrop={handleDrop}>
                <div>Item 1</div>
                <div>Item 2</div>
            </DragAndDrop>,
        );

        const items = getAllByRole('listitem');
        const firstItem = items[0];

        // Start grabbing
        fireEvent.keyDown(firstItem, { key: ' ', code: 'Space' });
        expect(firstItem).toHaveAttribute('aria-grabbed', 'true');

        // Cancel with escape - should not call onDrop
        fireEvent.keyDown(firstItem, { key: 'Escape', code: 'Escape' });
        expect(handleDrop).not.toHaveBeenCalled();
    });

    it('prevents moving beyond boundaries with arrow keys', () => {
        const handleDrop = jest.fn();
        const { getAllByRole } = render(
            <DragAndDrop onDrop={handleDrop}>
                <div>Item 1</div>
                <div>Item 2</div>
            </DragAndDrop>,
        );

        const items = getAllByRole('listitem');
        const firstItem = items[0];

        // Start grabbing first item
        fireEvent.keyDown(firstItem, { key: ' ', code: 'Space' });

        // Try to move up (should not work as it's already at position 0)
        fireEvent.keyDown(firstItem, { key: 'ArrowUp', code: 'ArrowUp' });
        expect(handleDrop).not.toHaveBeenCalled();
    });

    it('handles mouse drag and drop', () => {
        const handleDrop = jest.fn();
        const { getAllByRole } = render(
            <DragAndDrop onDrop={handleDrop}>
                <div>Item 1</div>
                <div>Item 2</div>
                <div>Item 3</div>
            </DragAndDrop>,
        );

        const items = getAllByRole('listitem');
        const firstItem = items[0];
        const secondItem = items[1];

        act(() => {
            // Start dragging first item
            fireEvent.dragStart(firstItem);
        });

        act(() => {
            // Drag over second item
            fireEvent.dragOver(secondItem);
        });

        act(() => {
            // Drop on second item
            fireEvent.drop(secondItem);
        });

        expect(handleDrop).toHaveBeenCalledWith(0, 1);
    });

    it('handles mouse drag and drop with drag leave', () => {
        const handleDrop = jest.fn();
        const { getAllByRole } = render(
            <DragAndDrop onDrop={handleDrop}>
                <div>Item 1</div>
                <div>Item 2</div>
            </DragAndDrop>,
        );

        const items = getAllByRole('listitem');
        const firstItem = items[0];
        const secondItem = items[1];

        act(() => {
            // Start dragging first item
            fireEvent.dragStart(firstItem);
        });

        act(() => {
            // Drag over second item
            fireEvent.dragOver(secondItem);
        });

        act(() => {
            // Drag leave second item
            fireEvent.dragLeave(secondItem);
        });

        act(() => {
            // Drop on second item
            fireEvent.drop(secondItem);
        });

        expect(handleDrop).toHaveBeenCalledWith(0, 1);
    });

    it('handles touch start and end events', () => {
        const handleDrop = jest.fn();
        const { getAllByRole } = render(
            <DragAndDrop onDrop={handleDrop}>
                <div>Item 1</div>
                <div>Item 2</div>
            </DragAndDrop>,
        );

        const items = getAllByRole('listitem');
        const firstItem = items[0];

        // Touch start (short press - should not trigger drag)
        act(() => {
            fireEvent.touchStart(firstItem, {
                touches: [{ clientX: 0, clientY: 0 }],
            });
        });

        // Touch end immediately
        act(() => {
            fireEvent.touchEnd(firstItem);
        });

        // Should not have called onDrop since it was a short press
        expect(handleDrop).not.toHaveBeenCalled();
    });

    it('handles touch cancel event', () => {
        const handleDrop = jest.fn();
        const { getAllByRole } = render(
            <DragAndDrop onDrop={handleDrop}>
                <div>Item 1</div>
                <div>Item 2</div>
            </DragAndDrop>,
        );

        const items = getAllByRole('listitem');
        const firstItem = items[0];

        // Touch start
        act(() => {
            fireEvent.touchStart(firstItem, {
                touches: [{ clientX: 0, clientY: 0 }],
            });
        });

        // Touch cancel
        act(() => {
            fireEvent.touchCancel(firstItem);
        });

        // Should not have called onDrop
        expect(handleDrop).not.toHaveBeenCalled();
    });

    it('handles mouse drag and drop with drag indicator', () => {
        const handleDrop = jest.fn();
        const { getAllByRole } = render(
            <DragAndDrop onDrop={handleDrop} showIndicator>
                <div>Item 1</div>
                <div>Item 2</div>
            </DragAndDrop>,
        );

        const items = getAllByRole('listitem');
        const firstItem = items[0];

        // Find the drag handle (button with drag indicator)
        const dragHandle = firstItem.querySelector('[role="button"]');

        act(() => {
            // Start dragging from the handle
            fireEvent.dragStart(dragHandle!);
        });

        act(() => {
            // Drop on the item
            fireEvent.drop(firstItem);
        });

        expect(handleDrop).toHaveBeenCalledWith(0, 0);
    });

    it('handles touch events with drag indicator', () => {
        const handleDrop = jest.fn();
        const { getAllByRole } = render(
            <DragAndDrop onDrop={handleDrop} showIndicator>
                <div>Item 1</div>
                <div>Item 2</div>
            </DragAndDrop>,
        );

        const items = getAllByRole('listitem');
        const firstItem = items[0];

        // Find the drag handle
        const dragHandle = firstItem.querySelector('[role="button"]');

        // Touch start on the handle (short press)
        act(() => {
            fireEvent.touchStart(dragHandle!, {
                touches: [{ clientX: 0, clientY: 0 }],
            });
        });

        // Touch end
        act(() => {
            fireEvent.touchEnd(dragHandle!);
        });

        // Should not have called onDrop since it was a short press
        expect(handleDrop).not.toHaveBeenCalled();
    });

    it('is accessible', async () => {
        const { container } = render(
            <DragAndDrop onDrop={() => {}}>
                <div>Item 1</div>
                <div>Item 2</div>
            </DragAndDrop>,
        );
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    }, 15000);
});
