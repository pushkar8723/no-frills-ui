import { useRef } from 'react';
import { Dialog, AlertDialog, DialogHeader, DialogBody, Button } from '../../src/components';

export default function LayerDemo() {
    const dialog = useRef<Dialog>();
    const alertDialog = useRef<AlertDialog>();
    return (
        <>
            <Button onClick={() => dialog.current?.open()}>Open Dialog</Button>
            <Dialog ref={dialog}>
                <DialogHeader>Just a simple dialog</DialogHeader>
                <DialogBody>
                    <Button onClick={() => alertDialog.current?.show()}>Open Another Dialog</Button>
                </DialogBody>
            </Dialog>
            <AlertDialog
                ref={alertDialog}
                header="Another dialog"
                body="This is another dialog, render on top of previous one without using z-index."
            />
        </>
    );
}
