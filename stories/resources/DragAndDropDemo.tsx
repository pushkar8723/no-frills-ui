import { useState } from 'react';
import { DragAndDrop, Card, CardBody, ORIENTATION } from '../../src/components';

export default function DragAndDropDemo(props: {
    orientation: ORIENTATION;
    showIndicator: boolean;
}) {
    const [items, setItems] = useState(['Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Pune']);

    const onDrop = (start: number, end: number) => {
        const newItems = [...items];
        const item = newItems.splice(start, 1);
        newItems.splice(end, 0, item[0]);
        setItems(newItems);
    };

    return (
        <DragAndDrop
            orientation={props.orientation}
            onDrop={onDrop}
            showIndicator={props.showIndicator}
        >
            {items.map((item) => (
                <Card key={item}>
                    <CardBody>{item}</CardBody>
                </Card>
            ))}
        </DragAndDrop>
    );
}
