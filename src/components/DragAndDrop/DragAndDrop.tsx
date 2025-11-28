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

const Container = styled.div<{orientation: ORIENTATION}>`
    flex: 1;
    display: flex;
    position: relative;
    flex-direction: ${props => props.orientation === ORIENTATION.HORIZONTAL ? 'row' : 'column'};
`;

export default function DragAndDrop(props: DragAndDropProps) {
    const { orientation, children, onDrop, showIndicator } = props;
    const [startIndex, setStartIndex] = useState<number>(null);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [dragOver, setDragOver] = useState<number>(null);

    const drop = (index: number) => {
        startIndex !== null && onDrop?.(startIndex, index);
        setStartIndex(null);
        setIsDragging(false);
    }

    return (<DragContext.Provider value={{ startIndex, setStartIndex, drop, isDragging, setIsDragging, setDragOver }}>
        <Container orientation={orientation}>
            {React.Children.map(children, (child, index) => (
                <DragItem index={index} orientation={orientation} showIndicator={showIndicator} dragOver={dragOver}>
                    {child}
                </DragItem>
            ))}
        </Container>
    </DragContext.Provider>);
}

DragAndDrop.defaultProps = {
    orientation: ORIENTATION.VERTICAL,
    showIndicator: false,
}
