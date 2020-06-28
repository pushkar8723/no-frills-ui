import React from 'react';
import Dialog, { DialogBody, DialogFooter } from './Dialog';
import { Button, ActionButton } from '../Button';

interface ConfirmOption {
    /** Shown as header of the dialog */
    header?: string | JSX.Element,
    /** Rendered as body of the dialog */
    body: string | JSX.Element,
    /** Accept button text */
    yesText?: string,
    /** Reject button text */
    noText?: string,
    /** Props for the dialog */
    props?: object,
}

export default function ConfirmDialog(options: ConfirmOption) {
    return new Promise((resolve, reject) => {
        const cancel = () => {
            dialog.close();
            reject();
        };
        const confirm = () => {
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
                    <Button onClick={cancel}>{options.noText || 'No'}</Button>
                    <ActionButton onClick={confirm}>{options.yesText || 'Yes'}</ActionButton>
                </DialogFooter>
                </>
            ),
            props: options.props,
        });
        dialog.open();
    });
}
