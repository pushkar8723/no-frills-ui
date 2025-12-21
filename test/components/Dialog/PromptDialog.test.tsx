import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import PromptDialog from '../../../src/components/Dialog/PromptDialog';

describe('PromptDialog', () => {
    let promptRef: React.RefObject<PromptDialog>;

    beforeEach(() => {
        jest.useFakeTimers();
        promptRef = React.createRef<PromptDialog>();
        render(
            <PromptDialog
                ref={promptRef}
                header="Prompt Header"
                body="Enter your name:"
                defaultValue=""
                submitText="Submit"
                cancelText="Cancel"
            />,
        );
    });

    afterEach(() => {
        // Clean up
        act(() => {
            jest.advanceTimersByTime(300);
        });
    });

    it('renders prompt dialog when show is called', () => {
        act(() => {
            promptRef.current?.show();
        });

        expect(screen.getByRole('dialog')).toBeTruthy();
        expect(screen.getByText('Prompt Header')).toBeTruthy();
        expect(screen.getByText('Enter your name:')).toBeTruthy();
        expect(screen.getByRole('textbox')).toBeTruthy();
        expect(screen.getByText('Submit')).toBeTruthy();
        expect(screen.getByText('Cancel')).toBeTruthy();
    });

    it('resolves with input value when Submit is clicked', async () => {
        let promise: Promise<unknown> | undefined;
        act(() => {
            promise = promptRef.current?.show();
        });

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'John Doe' } });

        fireEvent.click(screen.getByText('Submit'));
        act(() => {
            jest.advanceTimersByTime(300);
        });

        await expect(promise).resolves.toBe('John Doe');
    });

    it('does not close when Submit is clicked without value', () => {
        act(() => {
            promptRef.current?.show();
        });

        fireEvent.click(screen.getByText('Submit'));

        // Should still be open (validation)
        expect(screen.getByRole('dialog')).toBeTruthy();
    });

    it('rejects when Cancel is clicked', async () => {
        let promise: Promise<unknown> | undefined;
        act(() => {
            promise = promptRef.current?.show();
        });

        fireEvent.click(screen.getByText('Cancel'));
        act(() => {
            jest.advanceTimersByTime(300);
        });

        await expect(promise).rejects.toBeUndefined();
    });

    it('submits on form submit', async () => {
        let promise: Promise<unknown> | undefined;
        act(() => {
            promise = promptRef.current?.show();
        });

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'Form Submit' } });

        fireEvent.submit(screen.getByRole('textbox').closest('form')!);
        act(() => {
            jest.advanceTimersByTime(300);
        });

        await expect(promise).resolves.toBe('Form Submit');
    });

    it('does not close on ESC key press', () => {
        act(() => {
            promptRef.current?.show();
        });

        expect(screen.getByRole('dialog')).toBeTruthy();

        fireEvent.keyUp(document.body, { key: 'Escape', keyCode: 27 });

        // Should still be open
        expect(screen.getByRole('dialog')).toBeTruthy();
    });

    it('does not close on overlay click', () => {
        act(() => {
            promptRef.current?.show();
        });

        expect(screen.getByRole('dialog')).toBeTruthy();

        const container = screen.getByText('Enter your name:').parentElement?.parentElement;
        fireEvent.click(container!);

        // Should still be open
        expect(screen.getByRole('dialog')).toBeTruthy();
    });
});
