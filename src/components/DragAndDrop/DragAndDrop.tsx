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
} & PropsWithChildren<{}>;

/** Container Component */
const Container = styled.div<{ orientation: ORIENTATION }>`
    flex: 1;
    display: flex;
    position: relative;
    flex-wrap: wrap;
    flex-direction: ${(props) => (props.orientation === ORIENTATION.HORIZONTAL ? 'row' : 'column')};
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
    const { orientation, children, onDrop, showIndicator } = props;
    const [startIndex, setStartIndex] = useState<number>(null);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [dragOver, setDragOver] = useState<number>(null);

    /**
     * Drop handler invoked when a draggable item is released.
     * @param index
     */
    const drop = (index: number) => {
        startIndex !== null && onDrop?.(startIndex, index);
        setStartIndex(null);
        setIsDragging(false);
    };

    return (
        <DragContext.Provider
            value={{ startIndex, setStartIndex, drop, isDragging, setIsDragging, setDragOver }}
        >
            <Container orientation={orientation}>
                {React.Children.map(children, (child, index) => (
                    <DragItem
                        index={index}
                        orientation={orientation}
                        showIndicator={showIndicator}
                        dragOver={dragOver}
                    >
                        {child}
                    </DragItem>
                ))}
            </Container>
        </DragContext.Provider>
    );
}

DragAndDrop.defaultProps = {
    /** Orientation of the list layout */
    orientation: ORIENTATION.VERTICAL,
    /** Whether to display drag indicators for each list item */
    showIndicator: false,
};
