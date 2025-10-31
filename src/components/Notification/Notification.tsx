import React, { createRef } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
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
    }

    static defaultProps = {
        duration: 5000,
        sticky: false,
        type: NOTIFICATION_TYPE.INFO,
    }

    render():React.ReactNode {
        return null;
    }
}

/** Maps notification position to layer position */
const positionMap = {
    [NOTIFICATION_POSITION.TOP_LEFT]: LAYER_POSITION.TOP_LEFT,
    [NOTIFICATION_POSITION.TOP_RIGHT]: LAYER_POSITION.TOP_RIGHT,
    [NOTIFICATION_POSITION.BOTTOM_LEFT]: LAYER_POSITION.BOTTOM_LEFT,
    [NOTIFICATION_POSITION.BOTTOM_RIGHT]: LAYER_POSITION.BOTTOM_RIGHT,
}

/** Notification class */
class Notification {
    /** Helps in maintaining single instance for different positions. */
    private containers:Map<NOTIFICATION_POSITION, {
        ref: React.RefObject<NotificationManager>,
        element: HTMLDivElement,
    }> = new Map();
    
    /**
     * Adds a notification
     * 
     * @param position 
     * @param options 
     */
    public add = (position: NOTIFICATION_POSITION, options: NotificationOptions) => {
        let notification;
        if (!this.containers.has(position)) {
            const div = document?.createElement('div');
            const ref = createRef<NotificationManager>();
            const [Component] = LayerManager.renderLayer({
                closeOnEsc: false,
                closeOnOverlayClick: false,
                position: positionMap[position],
                alwaysOnTop: true,
                component: (
                    <NotificationManager
                        ref={ref}
                        position={position}
                        onEmpty={() => this.destroy(position)}
                    />
                )
            });
            this.containers.set(position, {
                ref,
                element: div,
            });
            ReactDOM.render(<Component />, div);
            notification = ref;
        } else {
            notification = this.containers.get(position).ref;
        }
        return notification.current.add(options);
    }

    /**
     * Removes a notification
     * 
     * @param position 
     * @param id 
     */
    public remove = (position: NOTIFICATION_POSITION, id: string) => {
        if (this.containers.has(position)) {
            this.containers.get(position).ref.current.remove(id);
        }
    }

    /**
     * Destroys entire stack of notifications.
     * 
     * @param position 
     */
    public destroy = (position: NOTIFICATION_POSITION) => {
        const notification = this.containers.get(position);
        ReactDOM.unmountComponentAtNode(notification.element);
        this.containers.delete(position);
    }
}

/** Export a singleton instance */
export default new Notification();
