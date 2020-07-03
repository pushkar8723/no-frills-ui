import React, { createRef } from 'react';
import PropTypes from 'prop-types';
import Dialog, { DialogBody, DialogFooter, DialogHeader } from './Dialog';
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
    dialogProps?: object,
}

export default class ConfirmDialog extends React.Component<ConfirmOption> {
    private dialog = createRef<Dialog>();

    static defaultProps = {
        yesText: 'Yes',
        noText: 'No'
    }

    public show = () => {
        return new Promise((resolve, reject) => {
            const onClose = (resp: boolean) => {
                if (resp)
                    resolve();
                else 
                    reject();
            }
            this.dialog.current.open(onClose);
        })
    }

    private cancel = () => this.dialog.current.close(false);
    private confirm = () => this.dialog.current.close(true);

    render() {
        const { header, body, yesText, noText, dialogProps } = this.props;
        return (
            <Dialog {...dialogProps} ref={this.dialog} closeOnEsc={false} closeOnOverlayClick={false}>
                {header && <DialogHeader>{header}</DialogHeader>}
                <DialogBody>{body}</DialogBody>
                <DialogFooter>
                    <Button onClick={this.cancel}>{noText}</Button>
                    <ActionButton onClick={this.confirm}>{yesText}</ActionButton>
                </DialogFooter>
            </Dialog>
        )
    }
}
