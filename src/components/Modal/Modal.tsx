import React from 'react';
import PropTypes from 'prop-types';
import LayerManager, { LAYER_POSITION } from '../../shared/LayerManager';
export {
    Header as ModalHeader,
    Body as ModalBody,
    Footer as ModalFooter,
} from '../../shared/styles';
import { DialogContainer as ModalContainer } from '../Dialog/Dialog';

const modalPropTypes = {
    /** Opens the modal */
    open: PropTypes.bool.isRequired,
    /** Closes the modal on esc */
    closeOnEsc: PropTypes.bool,
    /** Closes the modal on overlay click */
    closeOnOverlayClick: PropTypes.bool,
    /** Call back function called when the modal closes. */
    onClose: PropTypes.func,
};

type ModalProps = PropTypes.InferProps<typeof modalPropTypes>;

interface ModalState {
    open: boolean;
}

/**
 * Modal component
 *
 * A dialog window that sits on top of the main application content.
 * It disrupts the user's workflow to demand attention for a critical task or decision.
 *
 * Accessibility:
 * - Implements ARIA `role="dialog"` and `aria-modal="true"`.
 * - Traps focus effectively within the modal while open.
 * - Restores focus to the triggering element upon closure.
 * - Supports closing via ESC key and overlay click.
 */
export default class Modal extends React.Component<
    React.PropsWithChildren<ModalProps>,
    ModalState
> {
    state = {
        open: false,
    };

    static propTypes = modalPropTypes;

    static defaultProps = {
        closeOnEsc: true,
        closeOnOverlayClick: true,
    };

    /**
     * Syncs state with props.
     */
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

    /**
     * Internal close handler.
     * Restores focus and calls the external onClose callback.
     */
    private onClose = () => {
        this.restoreFocus();
        this.setState({
            open: false,
        });
        this.props.onClose?.();
        this.closeCallback = null;
        this.layer = null;
    };

    private lastFocusedElement: HTMLElement | null = null;
    private modalRef = React.createRef<HTMLDivElement>();

    /**
     * Retrieves all focusable elements within the modal.
     */
    private getFocusableElements = (): HTMLElement[] => {
        if (!this.modalRef.current) return [];
        return Array.from(
            this.modalRef.current.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
            ),
        ) as HTMLElement[];
    };

    /**
     * Handles keydown events to implement the focus trap.
     * Traps Tab and Shift+Tab within the modal.
     */
    private handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Tab') {
            const focusableElements = this.getFocusableElements();
            if (focusableElements.length === 0) return;

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        }
    };

    /**
     * Lifecycle method to save the currently focused element when the modal mounts while open.
     */
    componentDidMount() {
        if (this.props.open) {
            this.lastFocusedElement = document.activeElement as HTMLElement;
        }
    }

    /**
     * Lifecycle method to restore focus when the modal unmounts.
     */
    componentWillUnmount() {
        if (this.props.open) {
            this.restoreFocus();
        }
    }

    /**
     * Restores focus to the element that was focused before the modal opened.
     */
    private restoreFocus = () => {
        if (this.lastFocusedElement) {
            // Check if the element is still in the document
            const elementToBeFocused = this.lastFocusedElement;
            this.lastFocusedElement = null;
            setTimeout(() => {
                if (document.body.contains(elementToBeFocused)) {
                    elementToBeFocused.focus();
                }
            }, 100);
        }
    };

    /**
     * Callback ref to capture the Modal DOM element.
     * Triggers initial focus setting when the element mounts.
     */
    private setModalRef = (node: HTMLDivElement | null) => {
        // Update ref
        (this.modalRef as React.MutableRefObject<HTMLDivElement | null>).current = node;

        if (node) {
            // Set initial focus when the node is mounted
            this.setInitialFocus(node);
        }
    };

    /**
     * Sets initial focus within the modal.
     * Tries to focus the header (first child) first, then the first interactive element, or falls back to the container.
     */
    private setInitialFocus = (root: HTMLElement) => {
        // Try to find the header (assumed to be the first child)
        const firstChild = root.firstElementChild as HTMLElement;
        if (firstChild) {
            // Ensure it's focusable
            if (firstChild.getAttribute('tabindex') === null) {
                firstChild.setAttribute('tabindex', '-1');
            }
            firstChild.focus();
            return;
        }

        // Fallback to focusable elements
        const focusableElements = this.getFocusableElements();
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        } else {
            // Fallback to container
            root.focus();
        }
    };

    /**
     * Lifecycle method to handle Modal updates.
     * Manages opening/closing logic via LayerManager and focus preservation.
     */
    getSnapshotBeforeUpdate(prevProps: ModalProps) {
        const { open, closeOnEsc, closeOnOverlayClick, children, ...rest } = this.props;

        if (prevProps.open && !open) {
            this.closeCallback?.();
            this.restoreFocus();
        }

        if (!prevProps.open && open) {
            // Save current focus
            this.lastFocusedElement = document.activeElement as HTMLElement;

            this.layer = LayerManager.renderLayer({
                overlay: true,
                exitDelay: 300,
                position: LAYER_POSITION.DIALOG,
                closeCallback: this.onClose,
                closeOnEsc: closeOnEsc,
                closeOnOverlayClick: closeOnOverlayClick,
                component: (
                    <ModalContainer
                        {...rest}
                        ref={this.setModalRef}
                        role="dialog"
                        aria-modal="true"
                        tabIndex={-1}
                        onKeyDown={this.handleKeyDown}
                        onClick={(e) => e.stopPropagation()}
                        elevated
                    >
                        {children}
                    </ModalContainer>
                ),
            });
            this.closeCallback = this.layer[1];
            this.forceUpdate();
        }
    }

    /**
     * Renders the Modal component via the LayerManager portal.
     */
    render() {
        if (this.state.open && this.layer) {
            const [Component] = this.layer;
            return <Component />;
        }

        return null;
    }
}
