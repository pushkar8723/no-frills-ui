import React, { useRef } from 'react';
import {
    Dialog, AlertDialog, ConfirmDialog, PromptDialog,
    DialogHeader, DialogBody, DialogFooter
} from '../../src/components/Dialog';
import { Button } from '../../src/components/Button';

export default function DialogDemo() {
    const alertDialog = useRef<AlertDialog | null>(null);
    const confirmDialog = useRef<ConfirmDialog | null>(null);
    const promptDialog = useRef<PromptDialog | null>(null);
    const dialog = useRef<Dialog | null>(null);

    const showAlert = async () => {
        await alertDialog.current?.show();
        alert('Alert closed');
    }

    const confirm = async () => {
        try {
            await confirmDialog.current?.show();
            alert('Thanks! Glad you liked it.');
        } catch (e) {
            alert('Hmmm! Give it a try at least.');
        }
    }

    const show = async () => {
        try {
            const resp = await promptDialog.current?.show();
            alert(`Order placed for ${resp} products.`);
        } catch (e) {
            alert('Transaction canceled');
        }
    }

    const openDialog = () => {
        dialog.current?.open();
    }

    const closeDialog = () => {
        dialog.current?.close();
    }

    return (
        <>
            <div style={{ display: 'flex', flex: 1, justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <Button onClick={showAlert}>Alert Dialog</Button>
                <Button onClick={confirm}>Confirm Dialog</Button>
                <Button onClick={show}>Prompt Dialog</Button>
                <Button onClick={openDialog}>Open Dialog</Button>
            </div>
            <AlertDialog
                ref={alertDialog}
                header='📣 Attention!'
                body='This is just a async function call. No need to manage dialog state in your application.'
                buttonText='Got it!'
            />
            <ConfirmDialog
                ref={confirmDialog}
                header='💭 Feedback'
                body={`
                    The confirmation dialog is a async function call and results are returned via promise.
                    This means that there is no need to maintain dialog state in your application.
                    Do you think that this will help you keep your code clean and save time?
                `}
            />
            <PromptDialog
                ref={promptDialog}
                header='Bulk Order'
                body='Thanks for your interest in this product. If you like, you can place order multiple quantity.'
                defaultValue='1'
                inputProps={{
                    label: 'Enter Quantity',
                    type: 'number',
                    min: 1,
                    max: 10,
                    required: true,
                }}
            />
            <Dialog ref={dialog}>
                <DialogHeader>A custom dialog</DialogHeader>
                <DialogBody>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                    labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                    nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt
                    in culpa qui officia deserunt mollit anim id est laborum.
                </DialogBody>
                <DialogFooter>
                    <Button onClick={closeDialog}>Close Dialog</Button>
                </DialogFooter>
            </Dialog>
        </>
    )
}