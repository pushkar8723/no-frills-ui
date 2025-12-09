import { createRef, type RefObject } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import styled from '@emotion/styled';
import { getThemeValue, THEME_NAME } from '../../shared/constants';
import LayerManager, { LAYER_POSITION } from '../../shared/LayerManager';
import { Card } from '../Card';

// Visually hidden component for screen reader announcements
const VisuallyHidden = styled.div`
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
`;

export interface ToastOptions {
    text: string;
    buttonText?: string;
    buttonClick?: () => void;
    duration?: number;
    type?: TOAST_TYPE;
}

export enum TOAST_TYPE {
    NORMAL = 'NORMAL',
    INFO = 'INFO',
    SUCCESS = 'SUCCESS',
    WARNING = 'WARNING',
    DANGER = 'DANGER',
}

const getBackgroundColor = (type: TOAST_TYPE) => {
    switch (type) {
        case TOAST_TYPE.INFO:
            return getThemeValue(THEME_NAME.INFO);
        case TOAST_TYPE.SUCCESS:
            return getThemeValue(THEME_NAME.SUCCESS);
        case TOAST_TYPE.WARNING:
            return getThemeValue(THEME_NAME.WARNING);
        case TOAST_TYPE.DANGER:
            return getThemeValue(THEME_NAME.ERROR);
        case TOAST_TYPE.NORMAL:
            return getThemeValue(THEME_NAME.TOAST);
    }
};

const ToastContainer = styled(Card)<{ type: TOAST_TYPE }>`
    box-sizing: border-box;
    border-radius: 3px;
    padding: 12px;
    background-color: ${(props) => getBackgroundColor(props.type)};
    color: ${getThemeValue(THEME_NAME.TEXT_COLOR_LIGHT)};
    margin: 20px;
    font-size: 14px;
    line-height: 20px;
    transform: translateY(100%);
    transition: transform 0.3s ease;
    width: 344px;
    display: flex;
    align-items: center;
    position: relative;

    & svg {
        width: 20px;
        height: 20px;
        fill: currentColor;
    }

    @media (max-width: 480px) {
        & {
            margin: 0;
            width: 100vw;
            border-radius: 0;
        }
    }

    .nf-layer-enter & {
        transform: translateY(0%);
    }
`;

const TextContainer = styled.div`
    flex: 1;
`;

const CloseContainer = styled.button`
    background-color: transparent;
    color: ${getThemeValue(THEME_NAME.PRIMARY_LIGHT)};
    padding: 6px 10px;
    border: none;
    border-radius: 3px;
    text-transform: uppercase;
    cursor: pointer;

    &:focus {
        background-color: rgba(255, 255, 255, 0.1);
    }
`;

const DEFAULT_DURATION = 2000;

class Toast {
    private element: HTMLDivElement;
    private toast: ReturnType<typeof LayerManager.renderLayer>;
    private timeout: NodeJS.Timeout;
    private root: Root;
    private politeRegionRef: RefObject<HTMLDivElement>;
    private assertiveRegionRef: RefObject<HTMLDivElement>;
    private isPaused: boolean = false;
    private currentOptions: ToastOptions | null = null;

    constructor() {
        this.element = document?.createElement('div');
        this.politeRegionRef = createRef();
        this.assertiveRegionRef = createRef();
        this.setupKeyboardListeners();
    }

    /**
     * Set up keyboard listener for dismissing toast with Escape key
     */
    private setupKeyboardListeners = () => {
        if (typeof document !== 'undefined') {
            document.addEventListener('keydown', this.handleKeyDown);
        }
    };

    /**
     * Handle keyboard events for toast interaction
     */
    private handleKeyDown = (event: KeyboardEvent) => {
        if (!this.toast) return;

        // Escape key dismisses the toast
        if (event.key === 'Escape') {
            this.remove();
        }
        // Space key pauses/resumes auto-dismiss
        else if (event.key === ' ' && this.currentOptions) {
            event.preventDefault();
            if (this.isPaused) {
                this.resumeTimeout();
            } else {
                this.pauseTimeout();
            }
        }
    };

    /**
     * Update the appropriate live region with toast content
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

    public remove = () => {
        if (this.toast) {
            this.toast[1]();
            clearTimeout(this.timeout);
            this.timeout = null;
        }
        this.toast = null;

        setTimeout(() => {
            if (!this.toast) {
                this.root.unmount();
            }
        }, 300);
    };

    /**
     * Pause toast auto-dismiss
     */
    private pauseTimeout = () => {
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.isPaused = true;
        }
    };

    /**
     * Resume toast auto-dismiss
     */
    private resumeTimeout = () => {
        if (this.currentOptions && this.isPaused) {
            this.timeout = setTimeout(() => {
                this.remove();
            }, this.currentOptions.duration || DEFAULT_DURATION);
            this.isPaused = false;
        }
    };

    /**
     * Pause toast when user is hovering over it.
     */
    public pause = () => {
        this.pauseTimeout();
    };

    /**
     * Restart the removal of toast.
     */
    public resume = (options: ToastOptions) => () => {
        this.currentOptions = options;
        this.resumeTimeout();
    };

    public add(options: ToastOptions) {
        const { text, buttonText, buttonClick, duration, type = TOAST_TYPE.NORMAL } = options;
        this.currentOptions = options;
        this.isPaused = false;
        this.remove();

        // Determine if this is an assertive message (warning/danger)
        const isAssertive = type === TOAST_TYPE.WARNING || type === TOAST_TYPE.DANGER;

        // Announce to screen readers
        const announcement = buttonText ? `${text} ${buttonText} button available` : text;
        this.updateLiveRegion(announcement, isAssertive);

        this.toast = LayerManager.renderLayer({
            exitDelay: 300,
            closeOnEsc: false,
            closeOnOverlayClick: false,
            alwaysOnTop: true,
            position: LAYER_POSITION.BOTTOM_LEFT,
            component: (
                <>
                    {/* Persistent live regions for screen reader announcements */}
                    <VisuallyHidden
                        ref={this.politeRegionRef}
                        role="log"
                        aria-live="polite"
                        aria-atomic="true"
                    />
                    <VisuallyHidden
                        ref={this.assertiveRegionRef}
                        role="alert"
                        aria-live="assertive"
                        aria-atomic="true"
                    />
                    {/* Visual toast (hidden from screen readers) */}
                    <ToastContainer
                        {...options}
                        type={type}
                        elevated
                        onMouseEnter={this.pause}
                        onMouseLeave={this.resume(options)}
                        aria-hidden="true"
                    >
                        <TextContainer>{text}</TextContainer>
                        {buttonText && (
                            <CloseContainer
                                onClick={buttonClick}
                                type="button"
                                aria-label={`${buttonText} - Press Space to pause auto-dismiss, Escape to close`}
                            >
                                {buttonText}
                            </CloseContainer>
                        )}
                    </ToastContainer>
                </>
            ),
        });
        const Component = this.toast[0];
        this.root = createRoot(this.element);
        this.root.render(<Component />);

        this.timeout = setTimeout(() => {
            this.remove();
        }, duration || DEFAULT_DURATION);
    }
}

export default new Toast();
