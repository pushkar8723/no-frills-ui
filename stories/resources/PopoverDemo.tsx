import { useState } from 'react';
import { Button, Popover, POPOVER_POSITION } from '../../src/components';
import { Dummy } from './Dummy';

export default function PopoverDemo(props: { text: string; position: POPOVER_POSITION }) {
    const [open, setOpen] = useState(false);

    return (
        <Popover
            open={open}
            element={() => <Button onClick={() => setOpen(!open)}>{props.text}</Button>}
            onClose={() => setOpen(false)}
            position={props.position}
        >
            <Dummy>Popover content goes here</Dummy>
        </Popover>
    );
}
