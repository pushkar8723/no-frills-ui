import React, { type RefCallback } from 'react';
import PropTypes from 'prop-types';
import { flushSync } from 'react-dom';
import { createRoot, type Root } from 'react-dom/client';
import LayerManager, { LAYER_POSITION } from '../../shared/LayerManager';
import NotificationManager from './NotificationManager';
import { NOTIFICATION_POSITION, NOTIFICATION_TYPE, NotificationOptions } from './types';

type NotificationProps = PropTypes.InferProps<typeof StoryProps.propTypes>;

/** This component is only used for storybook documentation */
export class StoryProps extends React.Component<NotificationProps> {
    static propTypes = {
        /** Title of the notification */
        title: PropTypes.string.isRequired,
        /** Body of the notification */
        description: PropTypes.string.isRequired,
        /** Id for the notification, helps in de-duplication. */
        id: PropTypes.string,
        /** Duration for the notification in milliseconds */
        duration: PropTypes.number,
        /** Creates sticky notification */
        sticky: PropTypes.bool,
        /** Type of notification */
        type: PropTypes.oneOf([
            NOTIFICATION_TYPE.INFO,
            NOTIFICATION_TYPE.SUCCESS,
            NOTIFICATION_TYPE.WARNING,
            NOTIFICATION_TYPE.DANGER,
        ]),
        /** Action button text */
        buttonText: PropTypes.string,
        /** Action button click callback */
        buttonClick: PropTypes.func,
        /** Notification close callback. */
        onClose: PropTypes.func,
    };

    static defaultProps = {
        duration: 5000,
        sticky: false,
        type: NOTIFICATION_TYPE.INFO,
    };

    render(): React.ReactNode {
        return null;
    }
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

    /**
     * Adds a notification
     *
     * @param position - The position where the notification should appear
     * @param options - Configuration options for the notification
     * @returns The notification ID or a promise that resolves to the notification ID
     */
    public add = (position: NOTIFICATION_POSITION, options: NotificationOptions) => {
        if (!this.containers.has(position)) {
            /** Callback ref to capture the NotificationManager instance when it mounts */
            const refCallback: RefCallback<NotificationManager> = (instance) => {
                if (instance) {
                    const container = this.containers.get(position);
                    if (container) {
                        container.manager = instance;
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

        // If manager is not ready yet, wait a bit and retry
        return new Promise((resolve) => {
            setTimeout(() => {
                const container = this.containers.get(position);
                if (container && container.manager) {
                    resolve(container.manager.add(options));
                }
            }, 10);
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
            container.root.unmount();
            if (document.body.contains(container.div)) {
                document.body.removeChild(container.div);
            }
            this.containers.delete(position);
        }
    };
}

/** Export a singleton instance */
export default new Notification();
