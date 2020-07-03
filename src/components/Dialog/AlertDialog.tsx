import React, { createRef } from 'react';
import Dialog, { DialogBody, DialogFooter, DialogHeader } from './Dialog';
import { Button } from '../Button';

interface AlertOption {
    /** Shown as header of the dialog */
    header?: string | JSX.Element,
    /** Rendered in the body. */
    body: string | JSX.Element,
    /** Accept button text, default value is `OK` */
    buttonText?: string,
    /** props for the dialog */
    dialogProps?: object,
}

export default class AlertDialog extends React.Component<AlertOption> {
    private dialog = createRef<Dialog>();
    
    static defaultProps = {
        buttonText: 'OK'
    }

    public show = () => {
        return new Promise(resolve => {
            const onClose = () => resolve();
            this.dialog.current.open(onClose);
        });
    }

    private close = () => this.dialog.current.close();
    
    render() {
        return (
            <Dialog {...this.props.dialogProps} ref={this.dialog} closeOnEsc={false} closeOnOverlayClick={false}>
                { this.props.header && <DialogHeader>{this.props.header}</DialogHeader>}
                <DialogBody>{this.props.body}</DialogBody>
                <DialogFooter><Button onClick={this.close}>{this.props.buttonText}</Button></DialogFooter>
            </Dialog>
        );
    }
}
