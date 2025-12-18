import React, { createRef } from 'react';
import { Button } from '../Button';
import Dialog, { DialogBody, DialogFooter, DialogHeader } from './Dialog';

type AlertOption = {
    /** Shown as header of the dialog */
    header: string;
    /** Rendered in the body. */
    body: React.ReactNode;
    /** Accept button text */
    buttonText?: string;
    /** props for the dialog */
    dialogProps?: React.ComponentProps<typeof Dialog>;
};

let dialogCounter = 0;

export default class AlertDialog extends React.Component<AlertOption> {
    private dialog = createRef<Dialog>();

    static defaultProps = {
        buttonText: 'OK',
    };

    public show = () => {
        return new Promise((resolve) => {
            const onClose = () => resolve(null);
            this.dialog.current?.open(onClose);
        });
    };

    private close = () => this.dialog.current?.close();

    render() {
        const titleId = `nfui-alert-dialog-${dialogCounter++}-title`;
        const descriptionId = `nfui-alert-dialog-${dialogCounter++}-description`;

        return (
            <Dialog
                {...this.props.dialogProps}
                role="alertdialog"
                aria-labelledby={titleId}
                aria-describedby={descriptionId}
                ref={this.dialog}
                closeOnEsc={false}
                closeOnOverlayClick={false}
            >
                {this.props.header && <DialogHeader id={titleId}>{this.props.header}</DialogHeader>}
                <DialogBody id={descriptionId}>{this.props.body}</DialogBody>
                <DialogFooter>
                    <Button onClick={this.close}>{this.props.buttonText}</Button>
                </DialogFooter>
            </Dialog>
        );
    }
}
