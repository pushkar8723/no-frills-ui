import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { Dialog, DialogBody, DialogFooter } from '../../../src/components/Dialog';

describe('Dialog', () => {
    let dialogRef: React.RefObject<Dialog>;

    beforeEach(() => {
        jest.useFakeTimers();
        dialogRef = React.createRef<Dialog>();
        render(
            <Dialog ref={dialogRef}>
                <DialogBody data-testid="dialog-content">
                    This shows up inside the dialog.
                </DialogBody>
                <DialogFooter>
                    <button onClick={() => dialogRef.current?.close()}>Close</button>
                </DialogFooter>
            </Dialog>,
        );
    });

    afterEach(() => {
        // Clean up
        dialogRef.current?.close();
    });

    it('renders dialog when open is called', () => {
        act(() => {
            dialogRef.current?.open();
        });

        expect(screen.getByTestId('dialog-content')).toBeTruthy();
        expect(screen.getByRole('dialog')).toBeTruthy();
    });

    it('closes dialog when close is called', () => {
        const mockCallback = jest.fn();
        act(() => {
            dialogRef.current?.open(mockCallback);
        });
        expect(screen.getByTestId('dialog-content')).toBeTruthy();

        act(() => {
            dialogRef.current?.close('result');
        });
        act(() => {
            jest.advanceTimersByTime(300);
        });
        expect(mockCallback).toHaveBeenCalledWith('result');
    });

    it('closes dialog on ESC key press when closeOnEsc is true', () => {
        const mockCallback = jest.fn();
        const ref = React.createRef<Dialog>();
        render(
            <Dialog ref={ref} closeOnEsc={true}>
                <DialogBody data-testid="dialog-content">Dialog Content</DialogBody>
            </Dialog>,
        );
        act(() => {
            ref.current?.open(mockCallback);
        });
        expect(screen.getByTestId('dialog-content')).toBeTruthy();

        fireEvent.keyUp(document.body, { key: 'Escape', keyCode: 27 });
        act(() => {
            jest.advanceTimersByTime(300);
        });
        expect(mockCallback).toHaveBeenCalled();
    });

    it('does not close dialog on ESC when closeOnEsc is false', () => {
        const mockCallback = jest.fn();
        const ref = React.createRef<Dialog>();
        render(
            <Dialog ref={ref} closeOnEsc={false}>
                <DialogBody data-testid="dialog-content">Dialog Content</DialogBody>
            </Dialog>,
        );
        act(() => {
            ref.current?.open(mockCallback);
        });
        expect(screen.getByTestId('dialog-content')).toBeTruthy();

        fireEvent.keyUp(document.body, { key: 'Escape' });
        expect(mockCallback).not.toHaveBeenCalled();
    });

    it('closes dialog on overlay click when closeOnOverlayClick is true', () => {
        const mockCallback = jest.fn();
        const ref = React.createRef<Dialog>();
        render(
            <Dialog ref={ref} closeOnOverlayClick={true}>
                <DialogBody data-testid="dialog-content">Dialog Content</DialogBody>
            </Dialog>,
        );
        act(() => {
            ref.current?.open(mockCallback);
        });
        expect(screen.getByTestId('dialog-content')).toBeTruthy();

        const container = screen.getByTestId('dialog-content').parentElement?.parentElement;
        fireEvent.click(container!);
        act(() => {
            jest.advanceTimersByTime(300);
        });
        expect(mockCallback).toHaveBeenCalled();
    });

    it('does not close dialog on overlay click when closeOnOverlayClick is false', () => {
        const mockCallback = jest.fn();
        const ref = React.createRef<Dialog>();
        render(
            <Dialog ref={ref} closeOnOverlayClick={false}>
                <DialogBody data-testid="dialog-content">Dialog Content</DialogBody>
            </Dialog>,
        );
        act(() => {
            ref.current?.open(mockCallback);
        });
        expect(screen.getByTestId('dialog-content')).toBeTruthy();

        const container = screen.getByTestId('dialog-content').parentElement?.parentElement;
        fireEvent.click(container!);
        expect(mockCallback).not.toHaveBeenCalled();
    });

    it('has correct aria attributes', () => {
        act(() => {
            dialogRef.current?.open();
        });

        const dialogElement = screen.getByRole('dialog');
        expect(dialogElement.getAttribute('aria-modal')).toBe('true');
        expect(dialogElement.getAttribute('tabindex')).toBe('-1');
    });

    it('prevents event propagation on dialog click', () => {
        const mockCallback = jest.fn();
        const ref = React.createRef<Dialog>();
        render(
            <Dialog ref={ref} closeOnOverlayClick={true}>
                <DialogBody data-testid="dialog-content">Content</DialogBody>
            </Dialog>,
        );
        act(() => {
            ref.current?.open(mockCallback);
        });

        const dialogElement = screen.getByRole('dialog');
        fireEvent.click(dialogElement);
        expect(mockCallback).not.toHaveBeenCalled();
    });

    it('renders children correctly', () => {
        const ref = React.createRef<Dialog>();
        render(
            <Dialog ref={ref}>
                <div data-testid="custom-content">Custom Dialog</div>
            </Dialog>,
        );
        act(() => {
            ref.current?.open();
        });

        expect(screen.getByTestId('custom-content')).toBeTruthy();
    });

    it('passes additional props to container', () => {
        const ref = React.createRef<Dialog>();
        render(
            <Dialog ref={ref} className="custom-dialog">
                <DialogBody>Content</DialogBody>
            </Dialog>,
        );
        act(() => {
            ref.current?.open();
        });

        const dialogElement = screen.getByRole('dialog');
        expect(dialogElement.className).toContain('custom-dialog');
    });
});
