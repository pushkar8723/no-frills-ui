import React from 'react';
import { NOTIFICATION_POSITION, NotificationOptions, NOTIFICATION_TYPE } from './Notification';
import { Close, Info, ReportProblem, ErrorOutline, CheckCircle } from '../../icons';
import {
    Container, Notice, Title, IconContainer,
    FillParent, Body, CloseButton, Footer
} from './style';
import { ActionButton } from '../Button';

interface NotificationManagerProps {
    // Notification Position
    position: NOTIFICATION_POSITION,
    // Callback for when stack is emptied
    onEmpty: () => void;
}

// Notice prop
interface NoticeProp extends NotificationOptions {
    leaving?: boolean,
}

// Manager state
interface NotificationManagerState {
    notices: NoticeProp[],
}

type timeouts = {
    [id: string]: NodeJS.Timeout,
}

const DEFAULT_DURATION = 5000;

/**
 * Notification Manager class
 */
class NotificationManager extends React.Component<NotificationManagerProps, NotificationManagerState> {
    state:NotificationManagerState = {
        notices: [],
    };

    // bookkeeping for timeouts
    private timeouts: timeouts = {};

    // Set of notification ids
    private set = new Set<string>();

    /**
     * Removes a notification from stack if the notification with the given id is found.
     * 
     * @param id 
     */
    public remove = (id: string) => {
        // Trigger leaving animation.
        this.setState({
            notices: this.state.notices.map(notice => ({
                ...notice,
                leaving: notice.id === id ? true : notice.leaving,
            }))
        });

        // Remove notification on animation completion.
        setTimeout(() => {
            const notice = this.state.notices.find(notice => notice.id === id);
            if (notice) {
                // call close callback, ignore any errors in callback.
                if (notice.onClose) {
                    try {
                        notice.onClose();
                    } catch (e) {
                        console.warn('Error in notification close callback', e.message);
                    }
                }
    
                // Remove the notification
                this.setState({
                    notices: this.state.notices.filter(notice => notice.id !== id),
                }, () => {
                    // Check if the stack is empty and then call the 
                    // empty callback function.
                    if (this.state.notices.length === 0) {
                        this.props.onEmpty();
                    }
                });
            }
        }, 550);
    }

    /**
     * Adds a notification to stack.
     * 
     * @param notice
     */
    public add = (notice: NotificationOptions) => {
        // Generate unique id if not provided.
        const id = notice.id || (Math.random() * 10**7).toFixed(0);
        
        // De-dupe on id
        if (!this.set.has(id)) {
            // Add notice to the top of stack.
            this.setState({
                notices: [
                    {
                        ...notice,
                        id
                    },
                    ...this.state.notices,
                ],
            });

            // set timeout for closing the notification.
            if (!notice.sticky) {
                this.timeouts[id] = setTimeout(() => this.remove(id), notice.duration || DEFAULT_DURATION);
            }

            // Add id to the set.
            this.set.add(id);
        }

        return id;
    }

    /**
     * Handler for close button click.
     * 
     * @param id 
     */
    public closeClickHandler = (id: string) => () => {
        this.remove(id);
    }

    /**
     * Pause notification when user is hovering over it.
     * 
     * @param id
     */
    public pause = (id: string) => () => {
        clearTimeout(this.timeouts[id]);
    }

    /**
     * Restart the removal of notification.
     * 
     * @param id
     */
    public resume = (id: string) => () => {
        const notice = this.state.notices.find(notice => notice.id === id);
        if (!notice.sticky) {
            this.timeouts[id] = setTimeout(() => this.remove(id), DEFAULT_DURATION);
        }
    }
    
    render() {
        return (
            <Container position={this.props.position}>
            {this.state.notices.map(notice => {
                const {
                    id, title, description, leaving,
                    type = NOTIFICATION_TYPE.INFO, buttonText, buttonClick,
                } = notice;
                return (
                    <Notice
                        key={id}
                        {...notice}
                        position={this.props.position}
                        className={leaving ? 'leave' : ''}
                        onMouseEnter={this.pause(id)}
                        onMouseLeave={this.resume(id)}
                    >
                        <IconContainer type={type}>
                            {type === NOTIFICATION_TYPE.INFO && <Info />}
                            {type === NOTIFICATION_TYPE.SUCCESS && <CheckCircle />}
                            {type === NOTIFICATION_TYPE.WARNING && <ReportProblem />}
                            {type === NOTIFICATION_TYPE.DANGER && <ErrorOutline />}
                        </IconContainer>
                        <FillParent>
                            <Title type={type}>
                                <FillParent>{title}</FillParent>
                                <CloseButton onClick={this.closeClickHandler(id)}>
                                    <Close />
                                </CloseButton>
                            </Title>
                            <Body>{description}</Body>
                            { buttonText && (
                                <Footer>
                                    <ActionButton onClick={() => { buttonClick?.() }}>
                                        {buttonText}
                                    </ActionButton>
                                </Footer>
                            )}
                        </FillParent>
                    </Notice>
                )
            })}
            </Container>
        )
    }
}

export default NotificationManager;
