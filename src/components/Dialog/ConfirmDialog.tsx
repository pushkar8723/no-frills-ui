import React, { createRef } from 'react';
import PropTypes from 'prop-types';
import { Button, ActionButton } from '../Button';
import Dialog, { DialogBody, DialogFooter, DialogHeader } from './Dialog';

type ConfirmOption = PropTypes.InferProps<typeof ConfirmDialog.propTypes>;

export default class ConfirmDialog extends React.Component<ConfirmOption> {
    private dialog = createRef<Dialog>();

    static propTypes = {
        /** Shown as header of the dialog */
        header: PropTypes.string,
        /** Rendered as body of the dialog */
        body: PropTypes.string.isRequired,
        /** Accept button text */
        yesText: PropTypes.string,
        /** Reject button text */
        noText: PropTypes.string,
        /** Props for the dialog */
        dialogProps: PropTypes.object,
    };

    static defaultProps = {
        yesText: 'Yes',
        noText: 'No',
    };

    public show = () => {
        return new Promise((resolve, reject) => {
            const onClose = (resp: boolean) => {
                if (resp) {
                    resolve(null);
                } else {
                    reject();
                }
            };
            this.dialog.current.open(onClose);
        });
    };

    private cancel = () => this.dialog.current.close(false);
    private confirm = () => this.dialog.current.close(true);

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
