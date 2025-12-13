import React, { PropsWithChildren, useState } from 'react';
import styled from '@emotion/styled';
import DragItem from './DragItem';
import { ORIENTATION, DragContext } from './types';

type DragAndDropProps = {
    /** Orientation of the list layout */
    orientation: ORIENTATION;
    /** Drop event handler */
    onDrop: (start: number, end: number) => void;
    /** Shows drag indicator against each list item */
    showIndicator: boolean;
    /** i18n: Template for item aria-label. Placeholders: {:position}, {:grabKey}, {:moveKeys}, {:dropKey}, {:altDropKey} */
    itemAriaLabelTemplate?: string;
    /** i18n: Aria label for drag handle */
    dragHandleAriaLabel?: string;
    /** i18n: Template for grabbed announcement. Placeholders: {:position}, {:moveKeys}, {:dropKey}, {:altDropKey}, {:cancelKey} */
    grabbedAnnouncementTemplate?: string;
    /** i18n: Template for moved announcement. Placeholders: {:position} */
    movedAnnouncementTemplate?: string;
    /** i18n: Template for dropped announcement. Placeholders: {:position} */
    droppedAnnouncementTemplate?: string;
    /** i18n: Template for cancelled announcement */
    cancelledAnnouncementTemplate?: string;
} & PropsWithChildren<unknown>;

/** Container Component */
const Container = styled.div<{ orientation: ORIENTATION }>`
    flex: 1;
    display: flex;
    position: relative;
    flex-wrap: wrap;
    flex-direction: ${(props) => (props.orientation === ORIENTATION.HORIZONTAL ? 'row' : 'column')};
`;

/** Visually hidden but accessible to screen readers */
const VisuallyHidden = styled.div`
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
`;

/**
 * A drag and drop container component that enables reordering of child elements.
 *
 * @component
 * @example
 * ```tsx
 * <DragAndDrop
 *   orientation={ORIENTATION.VERTICAL}
 *   onDrop={(start, end) => handleReorder(start, end)}
 *   showIndicator={true}
 * >
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 * </DragAndDrop>
 * ```
 *
 * @param {DragAndDropProps} props - The component props
 * @param {ORIENTATION} props.orientation - Determines the layout direction (horizontal or vertical). Defaults to VERTICAL.
 * @param {(start: number, end: number) => void} props.onDrop - Callback fired when an item is dropped, receives the start and end indices
 * @param {boolean} props.showIndicator - Whether to display drag indicators for each list item. Defaults to false.
 * @param {React.ReactNode} props.children - Child elements to be rendered as draggable items
 *
 * @returns {JSX.Element} A draggable container with reorderable items
 */
export default function DragAndDrop(props: DragAndDropProps) {
    const {
        orientation,
        children,
        onDrop,
        showIndicator,
        itemAriaLabelTemplate,
        dragHandleAriaLabel,
        grabbedAnnouncementTemplate,
        movedAnnouncementTemplate,
        droppedAnnouncementTemplate,
        cancelledAnnouncementTemplate,
    } = props;
    const [startIndex, setStartIndex] = useState<number | null>(null);
    const [originalIndex, setOriginalIndex] = useState<number | null>(null);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [dragOver, setDragOver] = useState<number | null>(null);
    const [announcement, setAnnouncement] = useState<string | undefined>('');
    const childrenArray = React.Children.toArray(children);
    const totalItems = childrenArray.length;

    /**
     * Replace placeholders in i18n templates
     */
    const replacePlaceholders = (
        template: string,
        data: {
            position?: number;
            grabKey?: string;
            dropKey?: string;
            altDropKey?: string;
            cancelKey?: string;
            moveKeys?: string;
        },
    ): string => {
        return template
            .replace(/\{:position\}/g, String(data.position ?? ''))
            .replace(/\{:grabKey\}/g, data.grabKey ?? 'Space')
            .replace(/\{:dropKey\}/g, data.dropKey ?? 'Space')
            .replace(/\{:altDropKey\}/g, data.altDropKey ?? 'Enter')
            .replace(/\{:cancelKey\}/g, data.cancelKey ?? 'Escape')
            .replace(
                /\{:moveKeys\}/g,
                data.moveKeys ??
                    (orientation === ORIENTATION.VERTICAL ? 'Arrow Up/Down' : 'Arrow Left/Right'),
            );
    };

    // i18n configuration object
    const i18n = {
        itemAriaLabelTemplate:
            itemAriaLabelTemplate ??
            'Item {:position}. Press {:grabKey} to grab, {:moveKeys} to move, {:dropKey} or {:altDropKey} to drop',
        dragHandleAriaLabel: dragHandleAriaLabel ?? 'Drag to reorder',
        grabbedAnnouncementTemplate:
            grabbedAnnouncementTemplate ??
            'Item {:position} grabbed. Use {:moveKeys} to move, {:dropKey} or {:altDropKey} to drop, {:cancelKey} to cancel',
        movedAnnouncementTemplate:
            movedAnnouncementTemplate ?? 'Item moved to position {:position}',
        droppedAnnouncementTemplate:
            droppedAnnouncementTemplate ?? 'Item dropped at position {:position}',
        cancelledAnnouncementTemplate:
            cancelledAnnouncementTemplate ?? 'Drag cancelled, item restored to original position',
        replacePlaceholders,
    };

    /**
     * Drop handler invoked when a draggable item is released.
     * @param index
     */
    const drop = (index: number | null) => {
        if (startIndex !== null && index !== null) {
            onDrop?.(startIndex, index);
        }
        setStartIndex(null);
        setOriginalIndex(null);
        setIsDragging(false);
    };

    /**
     * Cancel handler to restore item to original position
     */
    const cancel = () => {
        if (originalIndex !== null && startIndex !== null && startIndex !== originalIndex) {
            onDrop?.(startIndex, originalIndex);
        }
        setStartIndex(null);
        setOriginalIndex(null);
        setIsDragging(false);
    };

    /**
     * Start grab handler to track original position
     */
    const startGrab = (index: number) => {
        setStartIndex(index);
        setOriginalIndex(index);
        setIsDragging(true);
    };

    return (
        <>
            <DragContext.Provider
                value={{
                    startIndex,
                    setStartIndex,
                    drop,
                    onDrop,
                    cancel,
                    startGrab,
                    isDragging,
                    setIsDragging,
                    setDragOver,
                    i18n,
                }}
            >
                <Container orientation={orientation} role="list">
                    {React.Children.map(childrenArray, (child, index) => (
                        <DragItem
                            index={index}
                            orientation={orientation}
                            showIndicator={showIndicator}
                            dragOver={dragOver}
                            totalItems={totalItems}
                            setAnnouncement={setAnnouncement}
                        >
                            {child}
                        </DragItem>
                    ))}
                </Container>
            </DragContext.Provider>
            <VisuallyHidden role="status" aria-live="polite" aria-atomic="true">
                {announcement}
            </VisuallyHidden>
        </>
    );
}

DragAndDrop.defaultProps = {
    /** Orientation of the list layout */
    orientation: ORIENTATION.VERTICAL,
    /** Whether to display drag indicators for each list item */
    showIndicator: false,
    /** Default item aria-label template */
    itemAriaLabelTemplate:
        'Item {:position}. Press {:grabKey} to grab, {:moveKeys} to move, {:dropKey} or {:altDropKey} to drop',
    /** Default drag handle aria-label */
    dragHandleAriaLabel: 'Drag to reorder',
    /** Default grabbed announcement template */
    grabbedAnnouncementTemplate:
        'Item {:position} grabbed. Use {:moveKeys} to move, {:dropKey} or {:altDropKey} to drop, {:cancelKey} to cancel',
    /** Default moved announcement template */
    movedAnnouncementTemplate: 'Item moved to position {:position}',
    /** Default dropped announcement template */
    droppedAnnouncementTemplate: 'Item dropped at position {:position}',
    /** Default cancelled announcement template */
    cancelledAnnouncementTemplate: 'Drag cancelled, item restored to original position',
};
