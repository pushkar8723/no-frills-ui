import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import LayerManager, { LAYER_POSITION } from '../../shared/LayerManager';
import { Card } from '../Card';

export const DialogContainer = styled(Card)`
    max-width: 768px;
    max-height: 80vh;
    transform: scale(0);
    opacity: 0;
    transition: all 0.3s ease;

    .nf-layer-enter & {
        opacity: 1;
        transform: scale(1);
    }

    .nf-layer-exit & {
        opacity: 0;
        transform: scale(0);
    }
`;

export {
    Header as DialogHeader,
    Body as DialogBody,
    Footer as DialogFooter,
} from '../../shared/styles';

type DialogOptions = PropTypes.InferProps<typeof Dialog.propTypes>;

interface DialogState {
    show: boolean;
    LayerComponent?: () => React.ReactPortal | null;
}

class Dialog extends React.Component<React.PropsWithChildren<DialogOptions>, DialogState> {
    static propTypes = {
        /** Flag to close dialog on `esc` click. Default value is true. */
        closeOnEsc: PropTypes.bool,
        /** Close layer overlay is clicked. Default value is true. */
        closeOnOverlayClick: PropTypes.bool,
    };

    static defaultProps = {
        closeOnEsc: true,
        closeOnOverlayClick: true,
    };

    private closeDialog: (resp?: unknown) => void;
    private onCloseFn: (resp?: unknown) => void;

    state: DialogState = {
        show: false,
        LayerComponent: undefined,
    };

    shouldComponentUpdate(nextProps: DialogOptions, nextState: DialogState) {
        return this.state.show !== nextState.show;
    }

    public open = (closeCallback?: (resp: unknown) => void) => {
        const { closeOnEsc, closeOnOverlayClick, children, ...rest } = this.props;

        const [Component, closeFn] = LayerManager.renderLayer({
            exitDelay: 300,
            overlay: true,
            closeOnEsc,
            closeCallback: this.closeCallback,
            closeOnOverlayClick,
            position: LAYER_POSITION.DIALOG,
            component: (
                <DialogContainer {...rest} onClick={(e) => e.stopPropagation()} elevated>
                    {children}
                </DialogContainer>
            ),
        });

        this.closeDialog = closeFn;

        this.setState({
            show: true,
            LayerComponent: Component,
        });
        this.onCloseFn = closeCallback;
    };

    public close = (resp?: unknown) => {
        this.closeDialog?.(resp);
    };

    private closeCallback = (resp?: unknown) => {
        this.setState({
            show: false,
            LayerComponent: undefined,
        });
        this.onCloseFn?.(resp);
    };

    render() {
        const { LayerComponent } = this.state;

        if (this.state.show && LayerComponent) {
            return <LayerComponent />;
        } else {
            return null;
        }
    }
}

export default Dialog;
