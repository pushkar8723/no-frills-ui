import React, { createRef } from 'react';
import styled from '@emotion/styled';
import { Button, ActionButton } from '../Button';
import { Input } from '../Input';
import Dialog, { DialogHeader, DialogBody, DialogFooter } from './Dialog';

type PromptOption = {
    /** Shown as header of the dialog */
    header: string;
    /** Rendered as the body of the dialog */
    body: string;
    /** Default value for the input. */
    defaultValue?: string;
    /** Submit button text. Default value is 'Submit' */
    submitText?: string;
    /** Cancel button text. Default value is 'Cancel' */
    cancelText?: string;
    /** Props for the input. */
    inputProps?: React.HTMLProps<HTMLInputElement>;
    /** Additional props for the dialog. */
    dialogProps?: Dialog['props'];
};

const BodyText = styled.p`
    margin-top: 0;
`;

const InputContainer = styled.div`
    display: flex;
    flex: 1;
    margin-top: 10px;

    & > label {
        flex: 1;
        width: 100%;
        padding: 0;

        & > input {
            width: 100%;
            padding: 0 8px;
            box-sizing: border-box;
        }
    }
`;

const StyledInput = styled(Input)`
    flex: 1;
    padding: 0;
`;

export default class PromptDialog extends React.Component<PromptOption, { value?: string }> {
    static propTypes = {};

    static defaultProps = {
        cancelText: 'Cancel',
        submitText: 'Submit',
        defaultValue: '',
    };

    constructor(props: PromptOption) {
        super(props);
        this.state = {
            value: props.defaultValue,
        };
    }

    private dialog = createRef<Dialog>();

    private valueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            value: e.target.value,
        });
    };

    private cancel = () => this.dialog.current?.close();

    private submit = (e: React.FormEvent) => {
        e.preventDefault();
        this.dialog.current?.close(this.state.value);
    };

    public show = () => {
        return new Promise((resolve, reject) => {
            const onClose = (value: unknown) => {
                if (value) {
                    resolve(value);
                } else {
                    reject();
                }
                this.setState({
                    value: this.props.defaultValue,
                });
            };
            this.dialog.current?.open(onClose);
        });
    };

    render() {
        const { header, body, inputProps, submitText, cancelText, dialogProps } = this.props;

        return (
            <Dialog
                {...dialogProps}
                ref={this.dialog}
                closeOnEsc={false}
                closeOnOverlayClick={false}
            >
                <form onSubmit={this.submit}>
                    {header && <DialogHeader>{header}</DialogHeader>}
                    <DialogBody>
                        <BodyText>{body}</BodyText>
                        <InputContainer>
                            <StyledInput
                                value={this.state.value}
                                onChange={this.valueChange}
                                {...inputProps}
                            />
                        </InputContainer>
                    </DialogBody>
                    <DialogFooter>
                        <Button type="button" onClick={this.cancel}>
                            {cancelText}
                        </Button>
                        <ActionButton>{submitText}</ActionButton>
                    </DialogFooter>
                </form>
            </Dialog>
        );
    }
}
