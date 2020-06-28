import React from 'react';
import Dialog, { DialogBody, DialogFooter } from './Dialog';
import { Button } from '../Button';

interface AlertOption {
    /** Shown as header of the dialog */
    header?: string | JSX.Element,
    /** Rendered in the body. */
    body: string | JSX.Element,
    /** Accept button text, default value is `OK` */
    buttonText?: string,
    /** props for the dialog */
    props?: object,
}

export default function AlertDialog(options: AlertOption) {
    return new Promise((resolve) => {
        const close = () => {
            dialog.close();
            resolve();
        };
        const dialog = new Dialog({
            closeOnEsc: false,
            closeOnOverlayClick: false,
            header: options.header,
            body: (
                <>
                <DialogBody>{options.body}</DialogBody>
                <DialogFooter>
                    <Button onClick={close}>{options.buttonText || 'OK'}</Button>
                </DialogFooter>
                </>
            ),
            props: options.props,
        });
        dialog.open();
    });
}
