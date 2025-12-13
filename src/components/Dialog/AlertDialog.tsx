import React, { createRef } from 'react';
import PropTypes from 'prop-types';
import { Button } from '../Button';
import Dialog, { DialogBody, DialogFooter, DialogHeader } from './Dialog';

type AlertOption = PropTypes.InferProps<typeof AlertDialog.propTypes>;

let dialogCounter = 0;

export default class AlertDialog extends React.Component<AlertOption> {
    private dialog = createRef<Dialog>();

    static propTypes = {
        /** Shown as header of the dialog */
        header: PropTypes.string,
        /** Rendered in the body. */
        body: PropTypes.any.isRequired,
        /** Accept button text, default value is `OK` */
        buttonText: PropTypes.string,
        /** props for the dialog */
        dialogProps: PropTypes.object,
    };

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
