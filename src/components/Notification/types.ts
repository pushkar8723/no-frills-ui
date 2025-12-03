/** Position for Notification */
export enum NOTIFICATION_POSITION {
    TOP_LEFT = 'TOP_LEFT',
    TOP_RIGHT = 'TOP_RIGHT',
    BOTTOM_LEFT = 'BOTTOM_LEFT',
    BOTTOM_RIGHT = 'BOTTOM_RIGHT',
}

/** Type of Notifications */
export enum NOTIFICATION_TYPE {
    INFO = 'INFO',
    SUCCESS = 'SUCCESS',
    DANGER = 'DANGER',
    WARNING = 'WARNING',
}

export interface NotificationOptions {
    /** Title of the notification */
    title: string;
    /** Body of the notification */
    description: string;
    /** Id for the notification, helps in de-duplication. */
    id?: string;
    /** Duration for the notification in milliseconds */
    duration?: number;
    /** Creates sticky notification */
    sticky?: boolean;
    /** Type of notification */
    type?: NOTIFICATION_TYPE;
    /** Action button text */
    buttonText?: string;
    /** Action button click callback */
    buttonClick?: () => void;
    /** Notification close callback. */
    onClose?: () => void;
}
