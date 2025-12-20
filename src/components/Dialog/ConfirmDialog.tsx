import React, { createRef } from 'react';
import { Button, ActionButton } from '../Button';
import Dialog, { DialogBody, DialogFooter, DialogHeader } from './Dialog';

type ConfirmOption = {
    /** Shown as header of the dialog */
    header: string;
    /** Rendered as body of the dialog */
    body: string;
    /** Accept button text */
    yesText?: string;
    /** Reject button text */
    noText?: string;
    /** Props for the dialog */
    dialogProps?: React.ComponentProps<typeof Dialog>;
};

export default class ConfirmDialog extends React.Component<ConfirmOption> {
    private dialog = createRef<Dialog>();

    static defaultProps = {
        yesText: 'Yes',
        noText: 'No',
    };

    public show = () => {
        return new Promise((resolve, reject) => {
            const onClose = (resp: unknown) => {
                if (resp) {
                    resolve(null);
                } else {
                    reject();
                }
            };
            this.dialog.current?.open(onClose);
        });
    };

    private cancel = () => this.dialog.current?.close(false);
    private confirm = () => this.dialog.current?.close(true);

    render() {
        const { header, body, yesText, noText, dialogProps } = this.props;
        return (
            <Dialog
                {...dialogProps}
                ref={this.dialog}
                closeOnEsc={false}
                closeOnOverlayClick={false}
            >
                {header && <DialogHeader>{header}</DialogHeader>}
                <DialogBody>{body}</DialogBody>
                <DialogFooter>
                    <Button onClick={this.cancel}>{noText}</Button>
                    <ActionButton onClick={this.confirm}>{yesText}</ActionButton>
                </DialogFooter>
            </Dialog>
        );
    }
}
