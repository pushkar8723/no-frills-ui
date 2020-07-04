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

export {
    Header as DialogHeader,
    Body as DialogBody,
    Footer as DialogFooter,
} from '../../shared/styles';

type DialogOptions = PropTypes.InferProps<typeof Dialog.propTypes>;

interface DialogState { show: boolean }

class Dialog extends React.Component<React.PropsWithChildren<DialogOptions>, DialogState> {
    static propTypes = {
        /** Flag to close dialog on `esc` click. Default value is true. */
        closeOnEsc: PropTypes.bool,
        /** Close layer overlay is clicked. Default value is true. */
        closeOnOverlayClick: PropTypes.bool,
    }

    static defaultProps = {
        closeOnEsc: true,
        closeOnOverlayClick: true,
    }

    private closeDialog: (resp?: any) => void;
    private onCloseFn: (resp?: any) => void;

    state = {
        show: false,
    }

    shouldComponentUpdate(nextProps: DialogOptions, nextState: DialogState) {
        return this.state.show !== nextState.show;
    }

    public open = (closeCallback?: (resp: any) => void) => {
        this.setState({
            show: true,
        });
        this.onCloseFn = closeCallback ;
    }

    public close = (resp?: any) => {
        this.closeDialog && this.closeDialog(resp);
    }

    private closeCallback = (resp?: any) => {
        this.setState({
            show: false,
        });
        this.onCloseFn && this.onCloseFn(resp);
    }

    render () {
        const { closeOnEsc, closeOnOverlayClick, children, ...rest} = this.props;

        if (this.state.show) {
            const [Component, closeFn ] = LayerManager.renderLayer({
                exitDelay: 300,
                overlay: true,
                closeOnEsc,
                closeCallback: this.closeCallback,
                closeOnOverlayClick,
                position: LAYER_POSITION.DIALOG,
                component: (
                    <DialogContainer {...rest} onClick={e => e.stopPropagation()}>
                        {children}
                    </DialogContainer>
                )
            });
            this.closeDialog = closeFn;
            return <Component />;
        } else {
            return null;
        }
    }
}

export default Dialog;
