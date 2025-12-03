import React from 'react';
import PropTypes from 'prop-types';
import LayerManager, { LAYER_POSITION } from '../../shared/LayerManager';
export {
    Header as ModalHeader,
    Body as ModalBody,
    Footer as ModalFooter,
} from '../../shared/styles';
import { DialogContainer as ModalContainer } from '../Dialog/Dialog';

type ModalProps = PropTypes.InferProps<typeof Modal.propTypes>;

interface ModalState {
    open: boolean;
}

export default class Modal extends React.Component<
    React.PropsWithChildren<ModalProps>,
    ModalState
> {
    state = {
        open: false,
    };

    static propTypes = {
        /** Opens the modal */
        open: PropTypes.bool.isRequired,
        /** Closes the modal on esc */
        closeOnEsc: PropTypes.bool,
        /** Closes the modal on overlay click */
        closeOnOverlayClick: PropTypes.bool,
        /** Call back function called when the modal closes. */
        onClose: PropTypes.func,
    };

    static defaultProps = {
        closeOnEsc: true,
        closeOnOverlayClick: true,
    };

    static getDerivedStateFromProps(props: ModalProps) {
        if (props.open) {
            return {
                open: true,
            };
        }
        return null;
    }

    private layer: ReturnType<typeof LayerManager.renderLayer>;

    private closeCallback: (resp?: unknown) => void;

    private onClose = () => {
        this.setState({
            open: false,
        });
        this.props.onClose && this.props.onClose();
        this.closeCallback = null;
        this.layer = null;
    };

    getSnapshotBeforeUpdate(prevProps: ModalProps) {
        const { open, closeOnEsc, closeOnOverlayClick, children, ...rest } = this.props;

        if (prevProps.open && !open) {
            this.closeCallback && this.closeCallback();
        }

        if (!prevProps.open && open) {
            this.layer = LayerManager.renderLayer({
                overlay: true,
                exitDelay: 300,
                position: LAYER_POSITION.DIALOG,
                closeCallback: this.onClose,
                closeOnEsc: closeOnEsc,
                closeOnOverlayClick: closeOnOverlayClick,
                component: (
                    <ModalContainer {...rest} onClick={(e) => e.stopPropagation()} elevated>
                        {children}
                    </ModalContainer>
                ),
            });
            this.closeCallback = this.layer[1];
            this.forceUpdate();
        }
    }

    render() {
        if (this.state.open && this.layer) {
            const [Component] = this.layer;
            return <Component />;
        }

        return null;
    }
}
