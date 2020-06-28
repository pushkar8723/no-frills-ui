import React from 'react';
import styled from '@emotion/styled';
import LayerManager from '../../shared/LayerManager';
import { Card } from '../Card';

const DialogContainer = styled(Card)`
    max-width: 768px;
    max-height: 80vh;
    transform: scale(0);
    opacity: 0;
    transition: all .3s ease;

    .nf-layer-enter & {
        opacity: 1;
        transform: scale(1);
    }

    .nf-layer-exit & {
        opacity: 0;
        transform: scale(0);
    }
`;

const Header = styled.div`
    padding: 10px 15px;
    line-height: 26px;
    border-bottom: 1px solid var(--border-light-color, #eeeeee);

    & > h1 {
        margin: 0;
        font-size: 16px;
    }
`;

export const DialogBody = styled.div`
    padding: 20px 15px;
`;

export const DialogFooter = styled.div`
    padding: 10px 15px;
    border-top: 1px solid var(--border-light-color, #eeeeee);
    display: flex;
    justify-content: flex-end;
`;

interface DialogOptions {
    /** Shown as header of the dialog */
    header?: string | JSX.Element;
    /** Rendered as the body of the dialog */
    body: string | JSX.Element;
    /** Flag to close dialog on `esc` click. Default value is true. */
    closeOnEsc?: boolean;
    /** Close layer overlay is clicked. Default value is true. */
    closeOnOverlayClick?: boolean;
    /** Callback function that is called when dialog is closed. */
    closeCallback?: () => void;
    /** Props for the dialog. */
    props?: object;
}

class Dialog {
    private option: DialogOptions;
    private closeDialog: () => void;
    
    constructor(option: DialogOptions) {
        this.option = option;
    }

    public open() {
        this.closeDialog = LayerManager.renderLayer({
            exitDelay: 300,
            overlay: true,
            closeOnEsc: this.option.closeOnEsc,
            closeCallback: this.option.closeCallback,
            closeOnOverlayClick: this.option.closeOnOverlayClick,
            component: (
                <DialogContainer {...this.option.props} onClick={e => e.stopPropagation()}>
                    {this.option.header && <Header><h1>{this.option.header}</h1></Header>}
                    {this.option.body}
                </DialogContainer>
            )
        });
    }

    public close() {
        this.closeDialog && this.closeDialog();
    }
}

export default Dialog;
