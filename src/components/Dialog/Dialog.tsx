import React from 'react';
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

interface DialogOptions {
    /** Flag to close dialog on `esc` click. Default value is true. */
    closeOnEsc?: boolean;
    /** Close layer overlay is clicked. Default value is true. */
    closeOnOverlayClick?: boolean;
}

interface DialogState {
    show: boolean;
    LayerComponent?: React.ComponentType | null;
}

class Dialog extends React.Component<
    React.PropsWithChildren<DialogOptions> & React.HTMLAttributes<HTMLDivElement>,
    DialogState
> {
    static defaultProps = {
        closeOnEsc: true,
        closeOnOverlayClick: true,
    };

    private closeDialog: ((resp?: unknown) => void) | null = null;
    private onCloseFn: ((resp?: unknown) => void) | null = null;
    private lastFocusedElement: HTMLElement | null = null;
    private dialogRef = React.createRef<HTMLDivElement>();

    state: DialogState = {
        show: false,
        LayerComponent: undefined,
    };

    /**
     * Retrieves all focusable elements within the dialog.
     */
    private getFocusableElements = (): HTMLElement[] => {
        if (!this.dialogRef.current) return [];
        return Array.from(
            this.dialogRef.current.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
            ),
        ) as HTMLElement[];
    };

    /**
     * Handles keydown events to implement the focus trap.
     * Traps Tab and Shift+Tab within the dialog.
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
     * Restores focus to the element that was focused before the dialog opened.
     */
    private restoreFocus = () => {
        if (this.lastFocusedElement) {
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
     * Callback ref to capture the Dialog DOM element.
     * Triggers initial focus setting when the element mounts.
     */
    private setDialogRef = (node: HTMLDivElement | null) => {
        (this.dialogRef as React.MutableRefObject<HTMLDivElement | null>).current = node;

        if (node) {
            this.setInitialFocus(node);
        }
    };

    /**
     * Sets initial focus within the dialog.
     * Tries to focus the header first, then the first interactive element, or falls back to the container.
     */
    private setInitialFocus = (root: HTMLElement) => {
        const firstChild = root.firstElementChild as HTMLElement;
        if (firstChild) {
            if (firstChild.getAttribute('tabindex') === null) {
                firstChild.setAttribute('tabindex', '-1');
            }
            firstChild.focus();
            return;
        }

        const focusableElements = this.getFocusableElements();
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        } else {
            root.focus();
        }
    };

    shouldComponentUpdate(nextProps: DialogOptions, nextState: DialogState) {
        return this.state.show !== nextState.show;
    }

    componentWillUnmount() {
        // Clean up if component unmounts while dialog is open
        if (this.state.show && this.closeDialog) {
            this.closeDialog();
        }
        this.restoreFocus();
        this.closeDialog = null;
        this.onCloseFn = null;
    }

    public open = (closeCallback?: (resp?: unknown) => void) => {
        const { closeOnEsc, closeOnOverlayClick, children, ...rest } = this.props;

        // Save current focus
        this.lastFocusedElement = document.activeElement as HTMLElement;

        const [Component, closeFn] = LayerManager.renderLayer({
            exitDelay: 300,
            overlay: true,
            closeOnEsc,
            closeCallback: this.closeCallback,
            closeOnOverlayClick,
            position: LAYER_POSITION.DIALOG,
            component: (
                <DialogContainer
                    {...rest}
                    ref={this.setDialogRef}
                    role="dialog"
                    aria-modal="true"
                    tabIndex={-1}
                    onKeyDown={this.handleKeyDown}
                    onClick={(e) => e.stopPropagation()}
                    elevated
                >
                    {children}
                </DialogContainer>
            ),
        });

        this.closeDialog = closeFn;

        this.setState({
            show: true,
            LayerComponent: Component,
        });
        this.onCloseFn = closeCallback ?? null;
    };

    public close = (resp?: unknown) => {
        this.closeDialog?.(resp);
    };

    private closeCallback = (resp?: unknown) => {
        this.restoreFocus();
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
