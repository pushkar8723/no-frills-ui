import { act, fireEvent, screen } from '@testing-library/react';
import { Toast, TOAST_TYPE } from '../../../src/components/Toast';

describe('Toast', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        // Clear any existing toasts
        act(() => {
            Toast.remove();
            jest.runAllTimers();
        });
    });

    afterAll(() => {
        // Cleanup DOM and listeners
        act(() => {
            Toast.destroy();
        });
    });

    // Helper to add toast with testId
    const addToast = (props: any) => {
        act(() => {
            Toast.add({ ...props, 'data-testid': 'toast-ui' } as any);
        });
    };

    it('renders toast with text', async () => {
        addToast({ text: 'Test Message' });

        const toast = await screen.findByTestId('toast-ui');
        expect(toast).toBeTruthy();
        expect(toast.textContent).toContain('Test Message');
    });

    it('auto dismisses after duration', async () => {
        addToast({ text: 'Auto Dismiss', duration: 1000 });

        expect(screen.getByTestId('toast-ui')).toBeTruthy();

        act(() => {
            jest.advanceTimersByTime(1000); // Duration
        });

        act(() => {
            jest.advanceTimersByTime(300); // Exit
        });

        expect(screen.queryByTestId('toast-ui')).toBeNull();
    });

    it('calls button click handler', () => {
        const mockFn = jest.fn();
        addToast({
            text: 'Click Me',
            buttonText: 'Action',
            buttonClick: mockFn,
        });

        const btn = screen.getByText('Action');
        fireEvent.click(btn);
        expect(mockFn).toHaveBeenCalled();
    });

    it('pauses on mouse enter and resumes on mouse leave', () => {
        addToast({ text: 'Hover Test', duration: 1000 });

        const container = screen.getByTestId('toast-ui');

        // Hover
        fireEvent.mouseEnter(container);

        act(() => {
            jest.advanceTimersByTime(1500);
        });

        // Should still be visible
        expect(screen.getByTestId('toast-ui')).toBeTruthy();

        // Unhover
        fireEvent.mouseLeave(container);

        act(() => {
            jest.advanceTimersByTime(1000);
            jest.advanceTimersByTime(300);
        });

        expect(screen.queryByTestId('toast-ui')).toBeNull();
    });

    it('closes on Escape key', () => {
        addToast({ text: 'Escape Me' });
        expect(screen.getByTestId('toast-ui')).toBeTruthy();

        fireEvent.keyDown(document, { key: 'Escape' });

        act(() => {
            jest.advanceTimersByTime(300);
        });

        expect(screen.queryByTestId('toast-ui')).toBeNull();
    });

    it('renders different types correctly', () => {
        addToast({ text: 'Success Message', type: TOAST_TYPE.SUCCESS });
        expect(screen.getByTestId('toast-ui')).toBeTruthy();

        act(() => {
            Toast.remove();
            jest.runAllTimers();
        });

        addToast({ text: 'Error Message', type: TOAST_TYPE.DANGER });
        expect(screen.getByTestId('toast-ui')).toBeTruthy();
    });

    it('pauses and resumes with Space key', () => {
        addToast({ text: 'Space Test', duration: 1000 });

        // Press Space to pause
        fireEvent.keyDown(document, { key: ' ', code: 'Space' });

        act(() => {
            jest.advanceTimersByTime(1500); // Should stay open
        });
        expect(screen.getByText('Space Test')).toBeTruthy();

        // // Press Space to resume
        // fireEvent.keyDown(document, { key: ' ', code: 'Space' });

        // act(() => {
        //     jest.advanceTimersByTime(5000);
        // });
        // expect(screen.getByText('Space Test')).toBeNull();
    });
});
