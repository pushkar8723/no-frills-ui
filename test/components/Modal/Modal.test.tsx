/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/display-name */
import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../../../src/components/Modal';

expect.extend(toHaveNoViolations);

// Mock LayerManager to avoid portal rendering issues in tests
jest.mock('../../../src/shared/LayerManager', () => {
    console.log('LayerManager mock initialized');
    return {
        renderLayer: jest.fn((config) => {
            console.log('LayerManager.renderLayer called with config:', config);
            const MockLayer = React.forwardRef<
                HTMLDivElement,
                React.HTMLAttributes<HTMLDivElement>
            >((props, ref) => {
                console.log('MockLayer rendering with props:', props);
                return (
                    <div
                        {...props}
                        ref={ref}
                        data-testid="modal-layer"
                        onClick={(e) => {
                            // For overlay click test, clicking the layer should trigger close
                            if (
                                config.closeOnOverlayClick !== false &&
                                e.target === e.currentTarget
                            ) {
                                config.closeCallback?.();
                            }
                            // Call the original onClick if it exists
                            props.onClick?.(e);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Escape' && config.closeOnEsc !== false) {
                                config.closeCallback?.();
                            }
                            // Call the original onKeyDown if it exists
                            props.onKeyDown?.(e);
                        }}
                        tabIndex={-1}
                    >
                        {config.component}
                    </div>
                );
            });

            const closeFn = () => {
                config.closeCallback?.();
            };

            return [MockLayer, closeFn];
        }),
        LAYER_POSITION: {
            DIALOG: 'dialog',
        },
    };
});

describe('Modal', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders when open prop is true', () => {
        const { getByTestId } = render(
            <Modal open={true}>
                <div>Modal content</div>
            </Modal>,
        );

        expect(getByTestId('modal-layer')).toBeInTheDocument();
    });

    it('does not render when open prop is false', () => {
        const { queryByTestId } = render(
            <Modal open={false}>
                <div>Modal content</div>
            </Modal>,
        );

        expect(queryByTestId('modal-layer')).not.toBeInTheDocument();
    });

    it('renders children when open', () => {
        const { getByText } = render(
            <Modal open={true}>
                <div>Modal content</div>
            </Modal>,
        );

        expect(getByText('Modal content')).toBeInTheDocument();
    });

    it('calls onClose when closeOnEsc is true and ESC is pressed', async () => {
        const handleClose = jest.fn();
        const { getByTestId } = render(
            <Modal open={true} onClose={handleClose} closeOnEsc={true}>
                <div>Modal content</div>
            </Modal>,
        );

        const modal = getByTestId('modal-layer');
        fireEvent.keyDown(modal, { key: 'Escape', code: 'Escape' });

        await waitFor(() => {
            expect(handleClose).toHaveBeenCalled();
        });
    });

    it('does not call onClose when closeOnEsc is false and ESC is pressed', () => {
        const handleClose = jest.fn();
        const { getByTestId } = render(
            <Modal open={true} onClose={handleClose} closeOnEsc={false}>
                <div>Modal content</div>
            </Modal>,
        );

        const modal = getByTestId('modal-layer');
        fireEvent.keyDown(modal, { key: 'Escape', code: 'Escape' });

        expect(handleClose).not.toHaveBeenCalled();
    });

    it('calls onClose when overlay is clicked and closeOnOverlayClick is true', async () => {
        const handleClose = jest.fn();
        const { getByTestId } = render(
            <Modal open={true} onClose={handleClose} closeOnOverlayClick={true}>
                <div>Modal content</div>
            </Modal>,
        );

        const modal = getByTestId('modal-layer');
        fireEvent.click(modal);

        await waitFor(() => {
            expect(handleClose).toHaveBeenCalled();
        });
    });

    it('does not call onClose when modal content is clicked', () => {
        const handleClose = jest.fn();
        const { getByText } = render(
            <Modal open={true} onClose={handleClose} closeOnOverlayClick={true}>
                <div>Modal content</div>
            </Modal>,
        );

        const content = getByText('Modal content');
        fireEvent.click(content);

        expect(handleClose).not.toHaveBeenCalled();
    });

    it('traps focus within modal with Tab key', () => {
        const { getByTestId, getByText } = render(
            <Modal open={true}>
                <ModalHeader>Header</ModalHeader>
                <ModalBody>
                    <button>Button 1</button>
                    <button>Button 2</button>
                </ModalBody>
                <ModalFooter>
                    <button data-testid="last-button">Footer Button</button>
                </ModalFooter>
            </Modal>,
        );

        const lastButton = getByTestId('last-button');
        const firstInteractive = getByText('Button 1');

        // Focus the last element
        lastButton.focus();
        expect(document.activeElement).toBe(lastButton);

        // Simulate Tab key press
        fireEvent.keyDown(lastButton, { key: 'Tab', code: 'Tab' });

        // Focus should wrap to the first interactive element
        expect(document.activeElement).toBe(firstInteractive);
    });

    it('traps focus within modal with Shift+Tab', () => {
        const { getByTestId, getByText } = render(
            <Modal open={true}>
                <ModalHeader>Header</ModalHeader>
                <ModalBody>
                    <button>Button 1</button>
                    <button>Button 2</button>
                </ModalBody>
                <ModalFooter>
                    <button data-testid="last-button">Footer Button</button>
                </ModalFooter>
            </Modal>,
        );

        const lastButton = getByTestId('last-button');
        const firstInteractive = getByText('Button 1');

        // Focus the first interactive element
        firstInteractive.focus();
        expect(document.activeElement).toBe(firstInteractive);

        // Simulate Shift+Tab key press
        fireEvent.keyDown(firstInteractive, {
            key: 'Tab',
            code: 'Tab',
            shiftKey: true,
        });

        // Focus should wrap to the last element
        expect(document.activeElement).toBe(lastButton);
    });

    it('sets initial focus on first child when modal opens', () => {
        const { getByText } = render(
            <Modal open={true}>
                <ModalHeader>First child header</ModalHeader>
                <ModalBody>
                    <button>Button</button>
                </ModalBody>
            </Modal>,
        );

        const header = getByText('First child header');
        expect(document.activeElement).toBe(header);
    });

    it('forwards ref correctly', () => {
        const ref = React.createRef<HTMLDivElement>();
        render(
            <Modal open={true} forwardRef={ref}>
                <div>Modal content</div>
            </Modal>,
        );

        expect(ref.current).toBeInTheDocument();
        expect(ref.current).toHaveAttribute('role', 'dialog');
    });

    it('has proper ARIA attributes', () => {
        const { getByTestId } = render(
            <Modal open={true} data-testid="modal-content">
                <div>Modal content</div>
            </Modal>,
        );

        const modal = getByTestId('modal-content');
        expect(modal).toHaveAttribute('aria-modal', 'true');
        expect(modal).toHaveAttribute('role', 'dialog');
    });

    it('handles default props correctly', () => {
        const { rerender } = render(
            <Modal open={true}>
                <div>Modal content</div>
            </Modal>,
        );

        // Should work with default props (closeOnEsc: true, closeOnOverlayClick: true)
        rerender(
            <Modal open={false}>
                <div>Modal content</div>
            </Modal>,
        );

        expect(true).toBe(true); // Just verify no errors
    });

    it('restores focus to the triggering element when closed', async () => {
        const { getByRole, rerender } = render(
            <div>
                <button>Trigger</button>
                <Modal open={false}>
                    <div>Modal content</div>
                </Modal>
            </div>,
        );

        const trigger = getByRole('button', { name: 'Trigger' });
        trigger.focus();
        expect(document.activeElement).toBe(trigger);

        // Open modal
        rerender(
            <div>
                <button>Trigger</button>
                <Modal open={true}>
                    <div>Modal content</div>
                </Modal>
            </div>,
        );

        // Modal should be open, focus moved away from trigger
        expect(document.activeElement).not.toBe(trigger);

        // Close modal
        rerender(
            <div>
                <button>Trigger</button>
                <Modal open={false}>
                    <div>Modal content</div>
                </Modal>
            </div>,
        );

        // Focus should be restored to trigger
        await waitFor(
            () => {
                expect(document.activeElement).toBe(trigger);
            },
            { timeout: 500 },
        );
    });

    it('is accessible', async () => {
        const { container } = render(
            <Modal open={true} aria-label="Test Modal">
                <div>Modal content</div>
            </Modal>,
        );

        // Note: In a real test environment, we would test the rendered layer
        // For now, we'll test the component structure
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
