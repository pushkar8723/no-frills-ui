import React, { createRef } from 'react';
import styled from '@emotion/styled';
import Dialog, { DialogHeader, DialogBody, DialogFooter } from './Dialog';
import { Button, ActionButton } from '../Button';
import { Input } from '../Input';

interface PromptOption {
    /** Shown as header of the dialog */
    header?: string | JSX.Element,
    /** Rendered as the body of the dialog */
    body?: string,
    /** Default value for the input. */
    defaultValue?: string,
    /** Submit button text. Default value is 'Submit' */
    submitText?: string,
    /** Cancel button text. Default value is 'Cancel' */
    cancelText?: string,
    /** Props for the input. */
    inputProps?: object,
    /** Props for the dialog. */
    dialogProps?: object,
}

const BodyText = styled.p`
    margin-top: 0;
`

export default class PromptDialog extends React.Component<PromptOption, { value: string }> {
    static defaultProps = {
        cancelText: 'Cancel',
        submitText: 'Submit',
        defaultValue: '',
    }

    constructor(props: PromptOption) {
        super(props);
        this.state = {
            value: props.defaultValue,
        }
    }
    
    private dialog = createRef<Dialog>();

    private valueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            value: e.target.value,
        })
    }

    private cancel = () => this.dialog.current.close();

    private submit = (e: React.FormEvent) => {
        e.preventDefault();
        this.dialog.current.close(this.state.value);
    }

    public show = () => {
        return new Promise((resolve, reject) => {
            const onClose = (value: string) => {
                if (value) {
                    resolve(value);
                } else {
                    reject();
                }
                this.setState({
                    value: this.props.defaultValue,
                });
            }
            this.dialog.current.open(onClose);
        });
    }

    render() {
        const { header, body, inputProps, submitText, cancelText, dialogProps } = this.props;

        return (
            <Dialog {...dialogProps} ref={this.dialog} closeOnEsc={false} closeOnOverlayClick={false}>
                <form onSubmit={this.submit}>
                    {header && <DialogHeader>{header}</DialogHeader>}
                    <DialogBody>
                        <BodyText>{body}</BodyText>
                        <div style={{ display: 'flex' }}>
                            <Input
                                style={{ width: 'auto', flex: '1' }}
                                value={this.state.value}
                                onChange={this.valueChange}
                                autoFocus
                                {...inputProps}
                            />
                        </div>
                    </DialogBody>
                    <DialogFooter>
                        <Button type='button' onClick={this.cancel}>{cancelText}</Button>
                        <ActionButton>{submitText}</ActionButton>
                    </DialogFooter>
                </form>
            </Dialog>
        )
    }

}
