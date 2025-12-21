import React from 'react';
import { Close, Info, ReportProblem, ErrorOutline, CheckCircle } from '../../icons';
import { ActionButton } from '../Button';
import {
    Container,
    Notice,
    Title,
    IconContainer,
    FillParent,
    Body,
    CloseButton,
    Footer,
    VisuallyHidden,
} from './style';
import { NOTIFICATION_POSITION, NOTIFICATION_TYPE, NotificationOptions } from './types';

interface NotificationManagerProps {
    // Notification Position
    position: NOTIFICATION_POSITION;
    // Callback for when stack is emptied
    onEmpty: () => void;
    // Aria label for the notification list
    ariaLabel?: string;
}

// Notice prop
interface NoticeProp extends NotificationOptions {
    leaving?: boolean;
}

// Manager state
interface NotificationManagerState {
    notices: NoticeProp[];
}

type timeouts = {
    [id: string]: NodeJS.Timeout;
};

const DEFAULT_DURATION = 5000;

/**
 * Notification Manager class
 */
class NotificationManager extends React.Component<
    NotificationManagerProps,
    NotificationManagerState
> {
    state: NotificationManagerState = {
        notices: [],
    };

    // bookkeeping for timeouts
    private timeouts: timeouts = {};

    // Set of notification ids
    private set = new Set<string>();

    // Refs for live regions to ensure they exist before updates
    private politeRegionRef = React.createRef<HTMLDivElement>();
    private assertiveRegionRef = React.createRef<HTMLDivElement>();

    /**
     * Removes a notification from stack if the notification with the given id is found.
     *
     * @param id
     */
    public remove = (id?: string) => {
        if (!id) return;

        // Trigger leaving animation.
        this.setState({
            notices: this.state.notices.map((notice) => ({
                ...notice,
                leaving: notice.id === id ? true : notice.leaving,
            })),
        });
        this.set.delete(id);

        // Remove notification on animation completion.
        setTimeout(() => {
            const notice = this.state.notices.find((notice) => notice.id === id);
            if (notice) {
                // call close callback, ignore any errors in callback.
                if (notice.onClose) {
                    try {
                        notice.onClose();
                    } catch (e: unknown) {
                        console.warn('Error in notification close callback', (e as Error).message);
                    }
                }

                // Remove the notification
                this.setState(
                    {
                        notices: this.state.notices.filter((notice) => notice.id !== id),
                    },
                    () => {
                        // Check if the stack is empty and then call the
                        // empty callback function.
                        if (this.state.notices.length === 0) {
                            this.props.onEmpty();
                        }
                    },
                );
            }
        }, 550);
    };

    /**
     * Adds a notification to stack.
     *
     * @param notice
     */
    public add = async (notice: NotificationOptions) => {
        // Generate unique id if not provided.
        const id = notice.id || (Math.random() * 10 ** 7).toFixed(0);

        // De-dupe on id
        if (!this.set.has(id)) {
            const type = notice.type || NOTIFICATION_TYPE.INFO;
            const isUrgent =
                type === NOTIFICATION_TYPE.WARNING || type === NOTIFICATION_TYPE.DANGER;

            // Add notice to the top of stack.
            this.setState(
                (prevState) => ({
                    notices: [
                        {
                            ...notice,
                            id,
                        },
                        ...prevState.notices,
                    ],
                }),
                () => {
                    // Update live region after state update
                    const announcement = `${notice.title} ${notice.description}`;
                    this.updateLiveRegion(announcement, isUrgent);
                },
            );

            // set timeout for closing the notification.
            if (!notice.sticky) {
                this.timeouts[id] = setTimeout(
                    () => this.remove(id),
                    notice.duration || DEFAULT_DURATION,
                );
            }

            // Add id to the set.
            this.set.add(id);
        }

        return id;
    };

    /**
     * Update live region content with clear-then-set pattern for reliable VoiceOver announcements.
     *
     * @param content - The text content to announce
     * @param isAssertive - Whether to use assertive (alert) or polite (log) live region
     */
    private updateLiveRegion = (content: string, isAssertive: boolean) => {
        const region = isAssertive ? this.assertiveRegionRef.current : this.politeRegionRef.current;

        if (region) {
            // Add content after delay
            setTimeout(() => {
                if (region) {
                    region.textContent = content;
                }
            }, 150);
        }
    };

    /**
     * Handler for close button click.
     *
     * @param id
     */
    public closeClickHandler = (id?: string) => () => {
        this.remove(id);
    };

    /**
     * Pause notification when user is hovering over it.
     *
     * @param id
     */
    public pause = (id?: string) => () => {
        if (id && this.timeouts[id]) {
            clearTimeout(this.timeouts[id]);
            delete this.timeouts[id];
        }
    };

    /**
     * Restart the removal of notification.
     *
     * @param id
     */
    public resume = (id?: string) => () => {
        const notice = this.state.notices.find((notice) => notice.id === id);
        if (!notice?.sticky && id && !this.timeouts[id]) {
            this.timeouts[id] = setTimeout(() => this.remove(id), DEFAULT_DURATION);
        }
    };

    /**
     * Clean up all pending timeouts when component unmounts
     */
    componentWillUnmount() {
        // Clear all pending timeouts
        Object.keys(this.timeouts).forEach((id) => {
            clearTimeout(this.timeouts[id]);
        });
        this.timeouts = {};
        this.set.clear();
    }

    render() {
        return (
            <Container position={this.props.position}>
                {/* Polite live region - uses role="log" for better VoiceOver compatibility */}
                <VisuallyHidden
                    ref={this.politeRegionRef}
                    role="log"
                    aria-live="polite"
                    aria-atomic="false"
                    aria-relevant="additions text"
                />

                {/* Assertive live region - pre-rendered and persistent */}
                <VisuallyHidden
                    ref={this.assertiveRegionRef}
                    role="alert"
                    aria-live="assertive"
                    aria-atomic="true"
                />

                {/* Visual notifications with list semantics */}
                <div role="list" aria-label={this.props.ariaLabel}>
                    {this.state.notices.map((notice) => {
                        const {
                            id,
                            title,
                            description,
                            leaving,
                            type = NOTIFICATION_TYPE.INFO,
                            buttonText,
                            buttonClick,
                            closeButtonAriaLabel,
                        } = notice;

                        return (
                            <Notice
                                key={id}
                                {...notice}
                                position={this.props.position}
                                className={leaving ? 'leave' : ''}
                                onMouseEnter={this.pause(id)}
                                onMouseLeave={this.resume(id)}
                                role="listitem"
                            >
                                <IconContainer type={type} aria-hidden="true">
                                    {type === NOTIFICATION_TYPE.INFO && <Info />}
                                    {type === NOTIFICATION_TYPE.SUCCESS && <CheckCircle />}
                                    {type === NOTIFICATION_TYPE.WARNING && <ReportProblem />}
                                    {type === NOTIFICATION_TYPE.DANGER && <ErrorOutline />}
                                </IconContainer>
                                <FillParent>
                                    <Title type={type}>{title}</Title>
                                    <Body>{description}</Body>
                                    {buttonText && (
                                        <Footer>
                                            <ActionButton
                                                onClick={() => {
                                                    buttonClick?.();
                                                }}
                                            >
                                                {buttonText}
                                            </ActionButton>
                                        </Footer>
                                    )}
                                </FillParent>
                                <CloseButton
                                    onClick={this.closeClickHandler(id)}
                                    aria-label={closeButtonAriaLabel || 'Close notification'}
                                    tabIndex={0}
                                >
                                    <Close />
                                </CloseButton>
                            </Notice>
                        );
                    })}
                </div>
            </Container>
        );
    }
}

export default NotificationManager;
