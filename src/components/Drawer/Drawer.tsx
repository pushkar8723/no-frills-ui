import React from 'react';
import styled from '@emotion/styled';
import { getThemeValue, THEME_NAME } from '../../shared/constants';
import LayerManager, { LAYER_POSITION } from '../../shared/LayerManager';

export {
    Header as DrawerHeader,
    Body as DrawerBody,
    Footer as DrawerFooter,
} from '../../shared/styles';

export enum DRAWER_POSITION {
    LEFT = 'LEFT',
    RIGHT = 'RIGHT',
    BOTTOM = 'BOTTOM',
}

const positionStyle = (size?: string) => ({
    [DRAWER_POSITION.LEFT]: {
        before: `height: 100vh; min-width: ${size || '300px'}; transform: translateX(-100%);`,
        after: 'transform: translateX(0%);',
    },
    [DRAWER_POSITION.RIGHT]: {
        before: `height: 100vh; min-width: ${size || '300px'}; transform: translateX(100%);`,
        after: 'transform: translateX(0%);',
    },
    [DRAWER_POSITION.BOTTOM]: {
        before: `
            position: absolute;
            bottom: 0;
            width: 100%;
            height: ${size || '90vh'};
            transform: translateY(100%);
            border-radius: 15px 15px 0 0; 
        `,
        after: 'transform: translateX(0%);',
    },
});

const DrawerDiv = styled.div<{ position: DRAWER_POSITION; size?: string }>`
    display: flex;
    flex-direction: column;
    background-color: ${getThemeValue(THEME_NAME.BACKGROUND)};
    transition: transform 0.3s ease;
    box-shadow: ${getThemeValue(THEME_NAME.MODAL_SHADOW)};
    ${(props) => positionStyle(props.size)[props.position].before}

    .nf-layer-enter & {
        transform: translateX(0%);
        ${(props) => positionStyle(props.size)[props.position].after}
    }
`;

type DrawerProps = {
    /** Opens the drawer */
    open: boolean;
    /** position of the drawer */
    position: DRAWER_POSITION;
    /** size of the drawer */
    size?: string;
    /** Shows an overlay behind the drawer. */
    overlay?: boolean;
    /** Closes the drawer on esc */
    closeOnEsc?: boolean;
    /** Closes the drawer on overlay click */
    closeOnOverlayClick?: boolean;
    /** Call back function called when the drawer closes. */
    onClose: () => void;
};

interface DrawerState {
    open: boolean;
}

const positionMap = {
    [DRAWER_POSITION.LEFT]: LAYER_POSITION.TOP_LEFT,
    [DRAWER_POSITION.RIGHT]: LAYER_POSITION.TOP_RIGHT,
    [DRAWER_POSITION.BOTTOM]: LAYER_POSITION.BOTTOM_LEFT,
};

/**
 * Drawer component
 *
 * A panel that slides in from the edge of the screen.
 * It sits on top of the application content and is often used for navigation or details.
 *
 * Accessibility:
 * - Implements ARIA `role="dialog"` and `aria-modal="true"`.
 * - Traps focus effectively within the drawer while open.
 * - Restores focus to the triggering element upon closure.
 * - Supports closing via ESC key and overlay click.
 */
export default class Drawer extends React.Component<
    React.PropsWithChildren<DrawerProps>,
    DrawerState
> {
    state = {
        open: false,
    };

    static defaultProps = {
        overlay: true,
        position: DRAWER_POSITION.LEFT,
        closeOnEsc: true,
        closeOnOverlayClick: true,
    };

    /**
     * Syncs state with props.
     */
    static getDerivedStateFromProps(props: DrawerProps) {
        if (props.open) {
            return {
                open: true,
            };
        }
        return null;
    }

    private layer?: ReturnType<typeof LayerManager.renderLayer> = undefined;

    private closeCallback?: (resp?: unknown) => void = undefined;

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
        this.closeCallback = undefined;
        this.layer = undefined;
    };

    private lastFocusedElement: HTMLElement | null = null;
    private drawerRef = React.createRef<HTMLDivElement>();

    /**
     * Retrieves all focusable elements within the drawer.
     */
    private getFocusableElements = (): HTMLElement[] => {
        if (!this.drawerRef.current) return [];
        return Array.from(
            this.drawerRef.current.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
            ),
        ) as HTMLElement[];
    };

    /**
     * Handles keydown events to implement the focus trap.
     * Traps Tab and Shift+Tab within the drawer.
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
     * Lifecycle method to save the currently focused element when the drawer mounts while open.
     */
    componentDidMount() {
        if (this.props.open) {
            this.lastFocusedElement = document.activeElement as HTMLElement;
        }
    }

    /**
     * Lifecycle method to restore focus when the drawer unmounts.
     */
    componentWillUnmount() {
        if (this.props.open) {
            this.restoreFocus();
        }
    }

    /**
     * Restores focus to the element that was focused before the drawer opened.
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
     * Callback ref to capture the Drawer DOM element.
     * Triggers initial focus setting when the element mounts.
     */
    private setDrawerRef = (node: HTMLDivElement | null) => {
        // Update ref
        (this.drawerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;

        if (node) {
            // Set initial focus when the node is mounted
            this.setInitialFocus(node);
        }
    };

    /**
     * Sets initial focus within the drawer.
     * Tries to focus the header first, then the first interactive element, or falls back to the container.
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
     * Lifecycle method to handle Drawer updates.
     * Manages opening/closing logic via LayerManager and focus preservation.
     */
    getSnapshotBeforeUpdate(prevProps: DrawerProps) {
        const {
            open,
            closeOnEsc,
            closeOnOverlayClick,
            overlay,
            position,
            children,
            size,
            ...rest
        } = this.props;

        if (prevProps.open && !open) {
            this.closeCallback?.();
            this.restoreFocus();
        }

        if (!prevProps.open && open) {
            // Save current focus
            this.lastFocusedElement = document.activeElement as HTMLElement;

            this.layer = LayerManager.renderLayer({
                overlay,
                exitDelay: 300,
                position: positionMap[position],
                closeCallback: this.onClose,
                closeOnEsc,
                closeOnOverlayClick,
                component: (
                    <DrawerDiv
                        {...rest}
                        ref={this.setDrawerRef}
                        role="dialog"
                        aria-modal="true"
                        tabIndex={-1}
                        onKeyDown={this.handleKeyDown}
                        position={position}
                        size={size}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {children}
                    </DrawerDiv>
                ),
            });
            this.closeCallback = this.layer[1];
            this.forceUpdate();
        }
    }

    /**
     * Renders the Drawer component via the LayerManager portal.
     */
    render() {
        if (this.state.open && this.layer) {
            const [Component] = this.layer;
            return <Component />;
        }

        return null;
    }
}
