import React, { DragEventHandler, PropsWithChildren, useContext, useState, useEffect, TouchEventHandler } from 'react';
import styled from '@emotion/styled';
import constants from '../../shared/constants';
import { ORIENTATION, DragContext } from './types';
import { DragIndicator } from '../../icons';

interface DragItemProps {
    index: number;
    orientation: ORIENTATION;
    showIndicator: boolean;
    dragOver: number;
}

const Item = styled.div<{active: number, orientation: ORIENTATION, showIndicator: boolean}>`
    cursor: ${props => props.showIndicator ? 'default' : 'move'};
    display: flex;
    user-select: ${props => props.showIndicator ? 'auto' : 'none'};
    border-top: 2px solid ${props => props.orientation === ORIENTATION.VERTICAL && props.active > 0
        ? constants.PRIMARY : 'transparent'};
    border-bottom: 2px solid ${props => props.orientation === ORIENTATION.VERTICAL && props.active < 0
        ? constants.PRIMARY : 'transparent'};
    border-left: 2px solid ${props => props.orientation === ORIENTATION.HORIZONTAL && props.active > 0
        ? constants.PRIMARY : 'transparent'};
    border-right: 2px solid ${props => props.orientation === ORIENTATION.HORIZONTAL && props.active < 0
        ? constants.PRIMARY : 'transparent'};
`;

const DragKnob = styled.div`
    padding-top: 8px;
    cursor: move;
    touch-action: none;
    color: var(--disabled, ${constants.DISABLED});
`;

const Container = styled.div`
    flex: 1;
`;

export default function DragItem(props: PropsWithChildren<DragItemProps>) {
    const { index, orientation, children, showIndicator, dragOver } = props;
    const [active, setActive] = useState(0);
    const [touchTimer, setTouchTimer] = useState<NodeJS.Timeout | null>(null);
    const context = useContext(DragContext);

    const vibrate = (duration: number) => {
        if (navigator.vibrate) {
            navigator.vibrate(duration);
        }
    };

    const dragStartHandler: DragEventHandler<HTMLDivElement> = (e) => {
        context.setStartIndex(index);
    }

    const dragOverHandler: DragEventHandler<HTMLDivElement> = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setActive(context.startIndex - index);
    }

    const dragExitHandler: DragEventHandler<HTMLDivElement> = () => {
        setActive(0);
    }

    const dropHandler: DragEventHandler<HTMLDivElement> = (e) => {
        e.preventDefault();
        setActive(0);
        context.drop(index);
    }

    const touchStartHandler: TouchEventHandler<HTMLDivElement> = (e) => {
        const timer = setTimeout(() => {
            context.setStartIndex(index);
            context.setIsDragging(true);
            context.setDragOver(index);
            document.body.style.overflow = 'hidden';
            vibrate(50);
        }, 200);
        
        setTouchTimer(timer);
    };

    const touchMoveHandler: TouchEventHandler<HTMLDivElement> = (e) => {
        const touch = e.touches[0];
        if (!touch) return;

        // get the element under the touch point
        if (context.isDragging) {
            const el = document.elementFromPoint(touch.clientX, touch.clientY) as HTMLElement | null;
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

    const touchEndHandler: TouchEventHandler<HTMLDivElement> = (e) => {
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

    useEffect(() => {
        return () => {
            if (touchTimer) clearTimeout(touchTimer);
        };
    }, [touchTimer]);

    useEffect(() => {
        if (context.isDragging && dragOver === index) {
            setActive(context.startIndex - index);
        } else {
            setActive(0);
        }
    }, [dragOver, context.startIndex, index, context.isDragging]);

    return <Item
        draggable={!showIndicator}
        showIndicator={showIndicator}
        active={active}
        orientation={orientation}
        data-drag-index={index}
        onDragStart={!showIndicator && dragStartHandler}
        onDragOver={dragOverHandler}
        onDragLeave={dragExitHandler}
        onDrop={dropHandler}
        onTouchStart={!showIndicator && touchStartHandler}
        onTouchMove={touchMoveHandler}
        onTouchEnd={touchEndHandler}
        onTouchCancel={touchEndHandler}
    >
        {showIndicator && <DragKnob
            draggable
            onDragStart={dragStartHandler}
            onTouchStart={touchStartHandler}
        ><DragIndicator /></DragKnob>}
        <Container>{children}</Container>
    </Item>;
}
