import React, { createRef } from 'react';
import PropTypes from 'prop-types';
import Dialog, { DialogBody, DialogFooter, DialogHeader } from './Dialog';
import { Button } from '../Button';

type AlertOption = PropTypes.InferProps<typeof AlertDialog.propTypes>;

export default class AlertDialog extends React.Component<AlertOption> {
    private dialog = createRef<Dialog>();
    
    static propTypes = {
        /** Shown as header of the dialog */
        header: PropTypes.string,
        /** Rendered in the body. */
        body: PropTypes.node.isRequired,
        /** Accept button text, default value is `OK` */
        buttonText: PropTypes.string,
        /** props for the dialog */
        dialogProps: PropTypes.object,
    }

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
