import React from 'react';
import PropTypes from 'prop-types';
import { TOAST_TYPE } from './Toast';

type ToastOptions = PropTypes.InferProps<typeof ToastStory.propTypes>;

/** This component is only used for storybook documentation */
export default class ToastStory extends React.Component<ToastOptions> {
    static propTypes = {
        /** Text of the toast */
        text: PropTypes.string.isRequired,
        /** Id for the notification, helps in de-duplication. */
        id: PropTypes.string,
        /** Duration for the toast in milliseconds */
        duration: PropTypes.number,
        /** Type of toast */
        type: PropTypes.oneOf([
            TOAST_TYPE.INFO,
            TOAST_TYPE.SUCCESS,
            TOAST_TYPE.WARNING,
            TOAST_TYPE.DANGER,
            TOAST_TYPE.NORMAL,
        ]),
        /** Action button text */
        buttonText: PropTypes.string,
        /** Action button click callback */
        buttonClick: PropTypes.func,
    };

    static defaultProps = {
        duration: 2000,
        type: TOAST_TYPE.NORMAL,
    };

    render(): React.ReactNode {
        return null;
    }
}
