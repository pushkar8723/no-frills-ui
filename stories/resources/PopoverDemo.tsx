import { forwardRef, useState } from 'react';
import { Button, Popover, POPOVER_POSITION } from '../../src/components';
import { Dummy } from './Dummy';

export default function PopoverDemo(props: { text: string; position: POPOVER_POSITION }) {
    const [open, setOpen] = useState(false);

    const PopoverButton = forwardRef<HTMLButtonElement>((passedProps, ref) => (
        <Button ref={ref} onClick={() => setOpen(!open)} {...passedProps}>
            {props.text}
        </Button>
    ));
    PopoverButton.displayName = 'PopoverButton';

    return (
        <Popover
            open={open}
            element={<PopoverButton />}
            onClose={() => setOpen(false)}
            position={props.position}
        >
            <Dummy>Popover content goes here</Dummy>
        </Popover>
    );
}
