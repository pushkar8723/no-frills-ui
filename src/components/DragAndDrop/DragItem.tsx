import {
    DragEventHandler,
    PropsWithChildren,
    useContext,
    useState,
    useEffect,
    TouchEventHandler,
} from 'react';
import styled from '@emotion/styled';
import { DragIndicator } from '../../icons';
import constants from '../../shared/constants';
import { ORIENTATION, DragContext } from './types';

interface DragItemProps {
    /** Position index of the draggable item */
    index: number;
    /** Orientation of the drag operation (VERTICAL or HORIZONTAL) */
    orientation: ORIENTATION;
    /** Whether to show a drag handle indicator instead of making the entire item draggable */
    showIndicator: boolean;
    /** The index of the item currently being dragged over */
    dragOver: number;
    /** Total number of items in the list */
    totalItems: number;
    /** Callback to set announcement for screen readers */
    setAnnouncement: (message: string) => void;
}

/** Styled component for the draggable item container */
const Item = styled.div<{
    active: number;
    orientation: ORIENTATION;
    showIndicator: boolean;
    dragging: boolean;
}>`
    cursor: ${(props) => (props.showIndicator ? 'default' : 'move')};
    display: flex;
    user-select: ${(props) => (props.showIndicator ? 'auto' : 'none')};
    border-top: 2px dashed
        ${(props) =>
            props.orientation === ORIENTATION.VERTICAL && props.active > 0
                ? constants.PRIMARY
                : 'transparent'};
    border-bottom: 2px dashed
        ${(props) =>
            props.orientation === ORIENTATION.VERTICAL && props.active < 0
                ? constants.PRIMARY
                : 'transparent'};
    border-left: 2px dashed
        ${(props) =>
            props.orientation === ORIENTATION.HORIZONTAL && props.active > 0
                ? constants.PRIMARY
                : 'transparent'};
    border-right: 2px dashed
        ${(props) =>
            props.orientation === ORIENTATION.HORIZONTAL && props.active < 0
                ? constants.PRIMARY
                : 'transparent'};
    opacity: ${(props) => (props.dragging ? 0.5 : 1)};
    border-radius: 10px;

    &:focus {
        box-shadow: 0 0 0 4px var(--primary, ${constants.PRIMARY_LIGHT});
    }

    &:focus:not(:focus-visible) {
        box-shadow: none;
    }

    &:focus-visible {
        box-shadow: 0 0 0 4px var(--primary, ${constants.PRIMARY_LIGHT});
    }
`;

/** Styled component for the drag handle indicator */
const DragKnob = styled.div`
    padding-top: 8px;
    cursor: move;
    touch-action: none;
    color: var(--disabled, ${constants.DISABLED});
`;

/** Container for the children */
const Container = styled.div`
    flex: 1;
`;

/**
 * A draggable item component that supports both mouse and touch interactions for drag-and-drop functionality.
 *
 * @component
 * @example
 * ```tsx
 * <DragItem
 *   index={0}
 *   orientation={ORIENTATION.VERTICAL}
 *   showIndicator={true}
 *   dragOver={-1}
 * >
 *   <div>Draggable content</div>
 * </DragItem>
 * ```
 *
 * @param props - The component props
 * @param props.index - The position index of this item in the draggable list
 * @param props.orientation - The orientation of the drag operation (VERTICAL or HORIZONTAL)
 * @param props.showIndicator - Whether to show a drag handle indicator instead of making the entire item draggable
 * @param props.dragOver - The index of the item currently being dragged over
 * @param props.children - The content to be rendered inside the draggable item
 *
 * @remarks
 * - Uses the DragContext to manage drag state across items
 * - Provides visual feedback with borders during drag operations
 * - Supports haptic feedback (vibration) on touch devices
 * - For touch devices, requires a 200ms hold before drag starts
 * - When showIndicator is true, only the drag handle can initiate drag operations
 *
 * @returns A draggable item with optional drag indicator and visual feedback
 */
export default function DragItem(props: PropsWithChildren<DragItemProps>) {
    const { index, orientation, children, showIndicator, dragOver, totalItems, setAnnouncement } =
        props;
    const [active, setActive] = useState(0);
    const [touchTimer, setTouchTimer] = useState<NodeJS.Timeout | null>(null);
    const context = useContext(DragContext);

    /**
     * Vibrate the device for haptic feedback
     * @param duration Duration of the vibration in milliseconds
     */
    const vibrate = (duration: number) => {
        if (navigator.vibrate) {
            navigator.vibrate(duration);
        }
    };

    /**
     * Drag start event handler
     * @param e Event
     */
    const dragStartHandler: DragEventHandler<HTMLDivElement> = () => {
        context.setStartIndex(index);
        context.setIsDragging(true);
    };

    /**
     * Drag over event handler
     * @param e Event
     */
    const dragOverHandler: DragEventHandler<HTMLDivElement> = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setActive(context.startIndex - index);
    };

    /**
     * Drag leave event handler
     */
    const dragExitHandler: DragEventHandler<HTMLDivElement> = () => {
        setActive(0);
    };

    /**
     * Drop event handler
     * @param e Event
     */
    const dropHandler: DragEventHandler<HTMLDivElement> = (e) => {
        e.preventDefault();
        setActive(0);
        context.drop(index);
        context.setIsDragging(false);
    };

    /**
     * Touch start event handler
     * @param e Event
     */
    const touchStartHandler: TouchEventHandler<HTMLDivElement> = () => {
        const timer = setTimeout(() => {
            context.setStartIndex(index);
            context.setIsDragging(true);
            context.setDragOver(index);
            document.body.style.overflow = 'hidden';
            vibrate(50);
        }, 200);

        setTouchTimer(timer);
    };

    /**
     * Touch move event handler
     * @param e Event
     * @returns void
     */
    const touchMoveHandler: TouchEventHandler<HTMLDivElement> = (e) => {
        const touch = e.touches[0];
        if (!touch) return;

        if (context.isDragging) {
            e.preventDefault();

            // get the element under the touch point
            const el = document.elementFromPoint(
                touch.clientX,
                touch.clientY,
            ) as HTMLElement | null;
            const overAttr = el?.closest('[data-drag-index]')?.getAttribute('data-drag-index');
            const overIndex = overAttr != null ? parseInt(overAttr, 10) : null;

            // if we know which index we're over, update visual state
            if (overIndex !== null) {
                context.setDragOver(overIndex);
            }
        } else if (touchTimer) {
            clearTimeout(touchTimer);
            setTouchTimer(null);
        }
    };

    /**
     * Touch end event handler
     * @param e Event
     */
    const touchEndHandler: TouchEventHandler<HTMLDivElement> = () => {
        if (touchTimer) {
            clearTimeout(touchTimer);
            setTouchTimer(null);
        }

        if (context.isDragging) {
            context.drop(dragOver);
            vibrate(50);
            context.setIsDragging(false);
            document.body.style.overflow = 'auto';
        }
    };

    /**
     * Keyboard navigation handler for reordering items
     * @param e Keyboard event
     */
    const handleKeyDown = (e: React.KeyboardEvent) => {
        const isVertical = orientation === ORIENTATION.VERTICAL;
        const moveUp = isVertical ? 'ArrowUp' : 'ArrowLeft';
        const moveDown = isVertical ? 'ArrowDown' : 'ArrowRight';

        const isGrabbed = context.isDragging && context.startIndex === index;

        // Space to grab/drop
        if (e.key === ' ' || e.key === 'Spacebar') {
            e.preventDefault();
            if (isGrabbed) {
                // Drop at current position
                context.drop(index);
                setAnnouncement(
                    context.i18n.replacePlaceholders(context.i18n.droppedAnnouncementTemplate, {
                        position: index + 1,
                    }),
                );
            } else {
                // Grab item
                context.startGrab(index);
                setAnnouncement(
                    context.i18n.replacePlaceholders(context.i18n.grabbedAnnouncementTemplate, {
                        position: index + 1,
                    }),
                );
            }
        }
        // Enter to drop
        else if (e.key === 'Enter' && isGrabbed) {
            e.preventDefault();
            context.drop(index);
            setAnnouncement(
                context.i18n.replacePlaceholders(context.i18n.droppedAnnouncementTemplate, {
                    position: index + 1,
                }),
            );
        }
        // Escape to cancel
        else if (e.key === 'Escape' && isGrabbed) {
            e.preventDefault();
            context.cancel();
            setAnnouncement(context.i18n.cancelledAnnouncementTemplate);
        }
        // Arrow keys to move while grabbed
        else if (isGrabbed) {
            if (e.key === moveUp && index > 0) {
                e.preventDefault();
                // Move without dropping - just reorder and update startIndex
                const newIndex = index - 1;
                context.onDrop(context.startIndex, newIndex);
                context.setStartIndex(newIndex);
                setAnnouncement(
                    context.i18n.replacePlaceholders(context.i18n.movedAnnouncementTemplate, {
                        position: newIndex + 1,
                    }),
                );
            } else if (e.key === moveDown && index < totalItems - 1) {
                e.preventDefault();
                // Move without dropping - just reorder and update startIndex
                const newIndex = index + 1;
                context.onDrop(context.startIndex, newIndex);
                context.setStartIndex(newIndex);
                setAnnouncement(
                    context.i18n.replacePlaceholders(context.i18n.movedAnnouncementTemplate, {
                        position: newIndex + 1,
                    }),
                );
            }
        }
    };

    /** Cleanup touch timer on unmount */
    useEffect(() => {
        return () => {
            if (touchTimer) clearTimeout(touchTimer);
            document.body.style.overflow = 'auto';
        };
    }, [touchTimer]);

    /** Update active state based on dragOver changes */
    useEffect(() => {
        if (context.isDragging && dragOver === index) {
            setActive(context.startIndex - index);
        } else {
            setActive(0);
        }
    }, [dragOver, context.startIndex, index, context.isDragging]);

    return (
        <Item
            draggable={!showIndicator}
            showIndicator={showIndicator}
            active={active}
            dragging={context.isDragging && context.startIndex === index}
            orientation={orientation}
            data-drag-index={index}
            tabIndex={0}
            role="listitem"
            aria-label={context.i18n.replacePlaceholders(context.i18n.itemAriaLabelTemplate, {
                position: index + 1,
            })}
            aria-grabbed={context.isDragging && context.startIndex === index}
            onKeyDown={handleKeyDown}
            onDragStart={!showIndicator ? dragStartHandler : undefined}
            onDragOver={dragOverHandler}
            onDragLeave={dragExitHandler}
            onDrop={dropHandler}
            onTouchStart={!showIndicator ? touchStartHandler : undefined}
            onTouchMove={touchMoveHandler}
            onTouchEnd={touchEndHandler}
            onTouchCancel={touchEndHandler}
        >
            {showIndicator && (
                <DragKnob
                    draggable
                    role="button"
                    aria-label={context.i18n.dragHandleAriaLabel}
                    onDragStart={dragStartHandler}
                    onTouchStart={touchStartHandler}
                    onKeyDown={handleKeyDown}
                    tabIndex={-1}
                >
                    <DragIndicator />
                </DragKnob>
            )}
            <Container>{children}</Container>
        </Item>
    );
}
