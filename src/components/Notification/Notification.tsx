import { type RefCallback } from 'react';
import { flushSync } from 'react-dom';
import { createRoot, type Root } from 'react-dom/client';
import LayerManager, { LAYER_POSITION } from '../../shared/LayerManager';
import NotificationManager from './NotificationManager';
import { NOTIFICATION_POSITION, NOTIFICATION_TYPE, NotificationOptions } from './types';

type NotificationProps = {
    /** Title of the notification */
    title: string;
    /** Body of the notification */
    description: string;
    /** Id for the notification, helps in de-duplication. */
    id?: string;
    /**
     * Duration for the notification in milliseconds
     * @default 5000
     */
    duration?: number;
    /**
     * Creates sticky notification
     * @default false
     */
    sticky?: boolean;
    /**
     * Type of notification
     * @default NOTIFICATION_TYPE.INFO
     */
    type?: NOTIFICATION_TYPE;
    /** Action button text */
    buttonText?: string;
    /** Action button click callback */
    buttonClick?: () => void;
    /** Notification close callback. */
    onClose?: () => void;
    /** Aria label for the close button on the notification. Defaults to "Close notification" */
    closeButtonAriaLabel?: string;
};

/**
 * This dummy component is used to extract props for documentation in Storybook.
 * @param props
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function StoryProps(props: NotificationProps) {
    return null;
}

/** Maps notification position to layer position */
const positionMap = {
    [NOTIFICATION_POSITION.TOP_LEFT]: LAYER_POSITION.TOP_LEFT,
    [NOTIFICATION_POSITION.TOP_RIGHT]: LAYER_POSITION.TOP_RIGHT,
    [NOTIFICATION_POSITION.BOTTOM_LEFT]: LAYER_POSITION.BOTTOM_LEFT,
    [NOTIFICATION_POSITION.BOTTOM_RIGHT]: LAYER_POSITION.BOTTOM_RIGHT,
};

/** Notification class */
class Notification {
    /** Helps in maintaining single instance for different positions. */
    private containers: Map<
        NOTIFICATION_POSITION,
        {
            manager: NotificationManager | null;
            root: Root;
            div: HTMLDivElement;
        }
    > = new Map();

    /** Pending add requests waiting for manager to mount */
    private pending: Map<NOTIFICATION_POSITION, Array<(manager: NotificationManager) => void>> =
        new Map();

    /**
     * Adds a notification
     *
     * @param position - The position where the notification should appear
     * @param options - Configuration options for the notification
     * @returns The notification ID or a promise that resolves to the notification ID
     */
    public add = (
        position: NOTIFICATION_POSITION,
        options: NotificationOptions,
        ariaLabel: string = 'Notifications',
    ) => {
        if (!this.containers.has(position)) {
            /** Callback ref to capture the NotificationManager instance when it mounts */
            const refCallback: RefCallback<NotificationManager> = (instance) => {
                if (instance) {
                    const container = this.containers.get(position);
                    if (container) {
                        container.manager = instance;
                    }

                    // Process pending requests
                    const queue = this.pending.get(position);
                    if (queue) {
                        queue.forEach((cb) => cb(instance));
                        this.pending.delete(position);
                    }
                }
            };

            const [Component] = LayerManager.renderLayer({
                closeOnEsc: false,
                closeOnOverlayClick: false,
                position: positionMap[position],
                alwaysOnTop: true,
                component: (
                    <NotificationManager
                        ref={refCallback}
                        position={position}
                        onEmpty={() => this.destroy(position)}
                        ariaLabel={ariaLabel}
                    />
                ),
            });

            // Create a div to mount the Component
            const div = document.createElement('div');
            document.body.appendChild(div);
            const root = createRoot(div);

            this.containers.set(position, {
                manager: null,
                root,
                div,
            });

            // Render the Component which will trigger the LayerManager's useEffect
            flushSync(() => {
                root.render(<Component />);
            });
        }

        const container = this.containers.get(position);
        if (container && container.manager) {
            return container.manager.add(options);
        }

        // If manager is not ready yet, add to pending queue
        return new Promise<string>((resolve) => {
            const queue = this.pending.get(position) || [];
            queue.push((manager) => {
                resolve(manager.add(options));
            });
            this.pending.set(position, queue);
        });
    };

    /**
     * Removes a notification
     *
     * @param position - The position of the notification container
     * @param id - The unique ID of the notification to remove
     */
    public remove = (position: NOTIFICATION_POSITION, id: string) => {
        const container = this.containers.get(position);
        if (container && container.manager) {
            container.manager.remove(id);
        }
    };

    /**
     * Destroys entire stack of notifications at a position.
     * Unmounts the React root and cleans up DOM elements.
     *
     * @param position - The position of the notification container to destroy
     */
    public destroy = (position: NOTIFICATION_POSITION) => {
        const container = this.containers.get(position);
        if (container) {
            // Defer unmount to avoid trying to synchronously unmount a root
            // while React is already rendering which can cause a race.
            setTimeout(() => {
                container.root.unmount();
                if (document.body.contains(container.div)) {
                    document.body.removeChild(container.div);
                }
                this.containers.delete(position);
            }, 0);
        }
    };
}

/** Export a singleton instance */
export default new Notification();
