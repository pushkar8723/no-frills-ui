import { act, fireEvent, screen, render } from '@testing-library/react';
import {
    Notification,
    NOTIFICATION_POSITION,
    NOTIFICATION_TYPE,
    NotificationOptions,
} from '../../../src/components/Notification';
import { StoryProps } from '../../../src/components/Notification/Notification';

describe('Notification', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        // Clear any existing notifications in all positions
        Object.values(NOTIFICATION_POSITION).forEach((position) => {
            act(() => {
                Notification.destroy(position);
            });
        });
    });

    afterAll(() => {
        // Cleanup DOM and listeners
        Object.values(NOTIFICATION_POSITION).forEach((position) => {
            act(() => {
                Notification.destroy(position);
            });
            jest.runOnlyPendingTimers();
        });
        jest.useRealTimers();
    });

    const addNotification = async (
        props: Partial<NotificationOptions> & { closeButtonAriaLabel?: string },
        position: NOTIFICATION_POSITION = NOTIFICATION_POSITION.TOP_RIGHT,
    ) => {
        const promise = Notification.add(position, { ...props } as NotificationOptions);

        // Flush effects to allow NotificationManager to mount and call the ref
        // We rely on the pending queue refactor in Notification.tsx
        await act(async () => {});

        return await promise;
    };

    it('renders notification with title and description', async () => {
        await addNotification({
            title: 'Test Title',
            description: 'Test Description',
        });

        const title = await screen.findByText('Test Title');
        const description = screen.getByText('Test Description');

        expect(title).toBeTruthy();
        expect(description).toBeTruthy();
    });

    it('auto dismisses after default duration', async () => {
        await addNotification({
            title: 'Auto Dismiss',
            description: 'Bye bye',
            duration: 1000,
        });

        expect(await screen.findByText('Auto Dismiss')).toBeTruthy();

        act(() => {
            jest.advanceTimersByTime(1000); // Duration
        });

        // Animation delay in NotificationManager is 550ms
        act(() => {
            jest.advanceTimersByTime(600);
        });

        expect(screen.queryByText('Auto Dismiss')).toBeNull();
    });

    it('calls button click handler', async () => {
        const mockFn = jest.fn();
        await addNotification({
            title: 'Click Me',
            description: 'Button test',
            buttonText: 'Action',
            buttonClick: mockFn,
        });

        const btn = await screen.findByText('Action');
        fireEvent.click(btn);
        expect(mockFn).toHaveBeenCalled();
    });

    it('closes when close button is clicked', async () => {
        await addNotification({
            title: 'Close Me',
            description: 'Close test',
            closeButtonAriaLabel: 'Close Notification Test',
        });

        expect(await screen.findByText('Close Me')).toBeTruthy();

        const closeBtn = screen.getByLabelText('Close Notification Test');
        fireEvent.click(closeBtn);

        // Animation delay
        act(() => {
            jest.advanceTimersByTime(600);
        });

        expect(screen.queryByText('Close Me')).toBeNull();
    });

    it('pauses on mouse enter and resumes on mouse leave', async () => {
        await addNotification({
            title: 'Hover Test',
            description: 'Hover description',
            duration: 1000,
        });

        const notice = (await screen.findByText('Hover Test')).closest('div[role="listitem"]');
        expect(notice).toBeTruthy();

        // Hover
        fireEvent.mouseEnter(notice!);

        act(() => {
            jest.advanceTimersByTime(1500);
        });

        // Should still be visible because it's paused
        expect(screen.queryByText('Hover Test')).toBeTruthy();

        // Unhover
        fireEvent.mouseLeave(notice!);

        // Resume sets timeout to default duration (5000ms)
        act(() => {
            jest.advanceTimersByTime(5000);
        });

        act(() => {
            jest.advanceTimersByTime(600); // Animation
        });

        expect(screen.queryByText('Hover Test')).toBeNull();
    });

    it('renders sticky notification that does not auto dismiss', async () => {
        await addNotification({
            title: 'Sticky',
            description: 'I stay',
            sticky: true,
            duration: 1000, // Should be ignored
        });

        expect(await screen.findByText('Sticky')).toBeTruthy();

        act(() => {
            jest.advanceTimersByTime(5000);
        });
        act(() => {
            jest.advanceTimersByTime(10000);
        });

        expect(screen.queryByText('Sticky')).toBeTruthy();
    });

    it('handles multiple notifications', async () => {
        await addNotification({ title: 'Note 1', description: 'Desc 1' });
        await addNotification({ title: 'Note 2', description: 'Desc 2' });

        expect(await screen.findByText('Note 1')).toBeTruthy();
        expect(await screen.findByText('Note 2')).toBeTruthy();
    });

    it('renders different types', async () => {
        await addNotification({
            title: 'Success',
            description: 'Success desc',
            type: NOTIFICATION_TYPE.SUCCESS,
        });
        await addNotification({
            title: 'Error',
            description: 'Error desc',
            type: NOTIFICATION_TYPE.DANGER,
        });
        await addNotification({
            title: 'Warning',
            description: 'Warning desc',
            type: NOTIFICATION_TYPE.WARNING,
        });

        expect(await screen.findByText('Success')).toBeTruthy();
        expect(await screen.findByText('Error')).toBeTruthy();
        expect(await screen.findByText('Warning')).toBeTruthy();
    });

    it('removes notification programmatically', async () => {
        const id = await addNotification({
            title: 'Remove specific',
            description: 'programmatic remove',
        });

        expect(await screen.findByText('Remove specific')).toBeTruthy();

        act(() => {
            Notification.remove(NOTIFICATION_POSITION.TOP_RIGHT, id);
        });

        // Animation
        act(() => {
            jest.advanceTimersByTime(600);
        });

        expect(screen.queryByText('Remove specific')).toBeNull();
    });

    it('destroys the manager', async () => {
        await addNotification({ title: 'Destroy me', description: 'desc' });
        expect(await screen.findByText('Destroy me')).toBeTruthy();

        act(() => {
            Notification.destroy(NOTIFICATION_POSITION.TOP_RIGHT);
        });

        // unmount is sync but effects might cleanup
        await act(async () => {});

        expect(screen.queryByText('Destroy me')).toBeNull();
    });

    it('exports StoryProps for documentation', () => {
        render(<StoryProps title="test" description="test" />);
    });
});
