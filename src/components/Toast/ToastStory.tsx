import { TOAST_TYPE } from './Toast';

type ToastOptions = {
    /** Text of the toast */
    text: string;
    /** Id for the notification, helps in de-duplication. */
    id?: string;
    /**
     * Duration for the toast in milliseconds
     * @default 2000
     */
    duration?: number;
    /**
     * Type of toast
     * @default TOAST_TYPE.NORMAL
     */
    type?: TOAST_TYPE;
    /** Action button text */
    buttonText?: string;
    /** Action button click callback */
    buttonClick?: () => void;
};

/** This component is only used for storybook documentation */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function ToastStory(props: ToastOptions) {
    return null;
}
