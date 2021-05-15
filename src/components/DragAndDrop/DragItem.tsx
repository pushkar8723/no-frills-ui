import React, { DragEventHandler, PropsWithChildren, useContext, useState } from 'react';
import styled from '@emotion/styled';
import constants from '../../shared/constants';
import { ORIENTATION, DragContext } from './types';
import { DragIndicator } from '../../icons';

interface DragItemProps {
    index: number;
    orientation: ORIENTATION;
    showIndicator: boolean;
}

const Item = styled.div<{active: number, orientation: ORIENTATION, showIndicator: boolean}>`
    cursor: ${props => props.showIndicator ? 'default' : 'move'};
    display: flex;
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
    color: var(--disabled, ${constants.DISABLED});
`;

const Container = styled.div`
    flex: 1;
`;

export default function DragItem(props: PropsWithChildren<DragItemProps>) {
    const { index, orientation, children, showIndicator } = props;
    const [active, setActive] = useState(0);
    const context = useContext(DragContext);

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

    return <Item
        draggable={!showIndicator}
        showIndicator={showIndicator}
        active={active}
        orientation={orientation}
        onDragStart={!showIndicator && dragStartHandler}
        onDragOver={dragOverHandler}
        onDragLeave={dragExitHandler}
        onDrop={dropHandler}
    >
        {showIndicator && <DragKnob
            draggable
            onDragStart={dragStartHandler}
        ><DragIndicator /></DragKnob>}
        <Container>{children}</Container>
    </Item>;
}
