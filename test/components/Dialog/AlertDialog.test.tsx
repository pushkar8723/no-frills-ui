import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { AlertDialog } from '../../../src/components/Dialog';

describe('AlertDialog', () => {
    let alertRef: React.RefObject<AlertDialog>;

    beforeEach(() => {
        jest.useFakeTimers();
        alertRef = React.createRef<AlertDialog>() as React.RefObject<AlertDialog>;
        render(
            <AlertDialog
                ref={alertRef}
                header="Alert Header"
                body="This is an alert message."
                buttonText="OK"
            />,
            { container: document.body },
        );
    });

    afterEach(() => {
        // Clean up
        act(() => {
            jest.advanceTimersByTime(300);
        });
    });

    it('renders alert dialog when show is called', () => {
        act(() => {
            alertRef.current?.show();
        });

        jest.advanceTimersByTime(1000);

        expect(screen.getByText('Alert Header')).toBeTruthy();
        expect(screen.getByText('This is an alert message.')).toBeTruthy();
        expect(screen.getByText('OK')).toBeTruthy();

        // Close by clicking OK
        fireEvent.click(screen.getByText('OK'));
        act(() => {
            jest.advanceTimersByTime(300);
        });
    });

    it('has correct aria attributes', () => {
        act(() => {
            alertRef.current?.show();
        });

        const dialog = screen.getByRole('alertdialog');
        expect(dialog).toBeTruthy();
        expect(dialog.getAttribute('aria-labelledby')).toBeTruthy();
        expect(dialog.getAttribute('aria-describedby')).toBeTruthy();
    });

    it('does not close on ESC key press', () => {
        act(() => {
            alertRef.current?.show();
        });

        expect(screen.getByRole('alertdialog')).toBeTruthy();

        fireEvent.keyUp(document.body, { key: 'Escape', keyCode: 27 });

        // Should still be open
        expect(screen.getByRole('alertdialog')).toBeTruthy();
    });

    it('does not close on overlay click', () => {
        act(() => {
            alertRef.current?.show();
        });

        expect(screen.getByRole('alertdialog')).toBeTruthy();

        const container = screen.getByText('This is an alert message.').parentElement
            ?.parentElement;
        fireEvent.click(container!);

        // Should still be open
        expect(screen.getByRole('alertdialog')).toBeTruthy();
    });
});
