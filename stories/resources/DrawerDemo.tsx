import React, { useState } from 'react';
import { Drawer, DrawerHeader, DrawerBody, DrawerFooter, Button } from '../../src/components';
import { DRAWER_POSITION } from '../../src/components/Drawer/Drawer';

export default function DrawerDemo() {
    const [open, setOpen] = useState(false);
    const [position, setPosition] = useState<DRAWER_POSITION>();

    return (
        <>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <Button onClick={() => { setPosition(DRAWER_POSITION.LEFT); setOpen(true);}}>Left Drawer</Button>
            <Button onClick={() => { setPosition(DRAWER_POSITION.BOTTOM); setOpen(true);}}>Bottom Drawer</Button>
            <Button onClick={() => { setPosition(DRAWER_POSITION.RIGHT); setOpen(true);}}>Right Drawer</Button>
        </div>
        <Drawer open={open} onClose={() => setOpen(false)} position={position}>
            <DrawerHeader>Its a Drawer!</DrawerHeader>
            <DrawerBody>
                Is it a modal? 🐦<br/>
                Is it a dialog? ✈️<br/>
                .<br/>
                .<br/>
                .<br/>
                No its a drawer! 🦸<br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                Sorry for the lame joke. 😅
            </DrawerBody>
            <DrawerFooter>
                <Button onClick={() => { setOpen(false) }}>Close</Button>
            </DrawerFooter>
        </Drawer>
        </>
    )
}