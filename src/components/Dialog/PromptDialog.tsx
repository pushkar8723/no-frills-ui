import React from 'react';
import styled from '@emotion/styled';
import Dialog, { DialogBody, DialogFooter } from './Dialog';
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
    props?: object,
}

const BodyText = styled.p`
    margin-top: 0;
`

export default function PromptDialog(options: PromptOption) {
    return new Promise((resolve, reject) => {
        let value: string = options.defaultValue;
        const cancel = () => {
            dialog.close();
            reject();
        };
        const confirm = (e: React.FormEvent) => {
            e.preventDefault();
            dialog.close();
            resolve(value);
        };

        const dialog = new Dialog({
            closeOnEsc: false,
            closeOnOverlayClick: false,
            header: options.header,
            body: (
                <form onSubmit={confirm}>
                    <DialogBody>
                        <BodyText>{options.body}</BodyText>
                        <div style={{ display: 'flex' }}>
                            <Input
                                style={{ width: 'auto', flex: '1' }}
                                value={options.defaultValue}
                                onChange={e => value = e.target.value}
                                autoFocus
                                {...options.inputProps}
                            />
                        </div>
                    </DialogBody>
                    <DialogFooter>
                        <Button type='button' onClick={cancel}>{options.cancelText || 'Cancel'}</Button>
                        <ActionButton>{options.submitText || 'Submit'}</ActionButton>
                    </DialogFooter>
                </form>
            ),
            props: options.props,
        });
        dialog.open();
    });
}
