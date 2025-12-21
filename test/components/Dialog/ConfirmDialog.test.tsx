import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import ConfirmDialog from '../../../src/components/Dialog/ConfirmDialog';

describe('ConfirmDialog', () => {
    let confirmRef: React.RefObject<ConfirmDialog>;

    beforeEach(() => {
        jest.useFakeTimers();
        confirmRef = React.createRef<ConfirmDialog>() as React.RefObject<ConfirmDialog>;
        render(
            <ConfirmDialog
                ref={confirmRef}
                header="Confirm Header"
                body="Are you sure?"
                yesText="Yes"
                noText="No"
            />,
        );
    });

    afterEach(() => {
        // Clean up
        act(() => {
            jest.advanceTimersByTime(300);
        });
    });

    it('renders confirm dialog when show is called', () => {
        act(() => {
            confirmRef.current?.show();
        });

        expect(screen.getByRole('dialog')).toBeTruthy();
        expect(screen.getByText('Confirm Header')).toBeTruthy();
        expect(screen.getByText('Are you sure?')).toBeTruthy();
        expect(screen.getByText('Yes')).toBeTruthy();
        expect(screen.getByText('No')).toBeTruthy();
    });

    it('resolves when Yes is clicked', async () => {
        let promise: Promise<unknown> | undefined;
        act(() => {
            promise = confirmRef.current?.show();
        });

        fireEvent.click(screen.getByText('Yes'));
        act(() => {
            jest.advanceTimersByTime(300);
        });

        await expect(promise).resolves.toBeNull();
    });

    it('rejects when No is clicked', async () => {
        let promise: Promise<unknown> | undefined;
        act(() => {
            promise = confirmRef.current?.show();
        });

        fireEvent.click(screen.getByText('No'));
        act(() => {
            jest.advanceTimersByTime(300);
        });

        await expect(promise).rejects.toBeUndefined();
    });

    it('does not close on ESC key press', () => {
        act(() => {
            confirmRef.current?.show();
        });

        expect(screen.getByRole('dialog')).toBeTruthy();

        fireEvent.keyUp(document.body, { key: 'Escape', keyCode: 27 });

        // Should still be open
        expect(screen.getByRole('dialog')).toBeTruthy();
    });

    it('does not close on overlay click', () => {
        act(() => {
            confirmRef.current?.show();
        });

        expect(screen.getByRole('dialog')).toBeTruthy();

        const container = screen.getByText('Are you sure?').parentElement?.parentElement;
        fireEvent.click(container!);

        // Should still be open
        expect(screen.getByRole('dialog')).toBeTruthy();
    });
});
