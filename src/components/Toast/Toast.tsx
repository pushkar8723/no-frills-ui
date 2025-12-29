import { createRoot, type Root } from 'react-dom/client';
import styled from '@emotion/styled';
import { getThemeValue, THEME_NAME } from '../../shared/constants';
import LayerManager, { LAYER_POSITION } from '../../shared/LayerManager';
import { Card } from '../Card';

export interface ToastOptions {
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

const createAriaLiveRegion = (id: string, ariaLive: 'polite' | 'assertive') => {
    const region = document.createElement('div');
    region.id = id;
    region.style.position = 'absolute';
    region.style.width = '1px';
    region.style.height = '1px';
    region.style.padding = '0';
    region.style.margin = '-1px';
    region.style.overflow = 'hidden';
    region.style.clip = 'rect(0, 0, 0, 0)';
    region.style.whiteSpace = 'nowrap';
    region.style.borderWidth = '0';
    region.setAttribute('role', ariaLive === 'assertive' ? 'alert' : 'log');
    region.setAttribute('aria-live', ariaLive);
    region.setAttribute('aria-atomic', 'true');
    return region;
};

class Toast {
    private element?: HTMLDivElement;
    private ariaLiveContainer?: HTMLDivElement;
    private toast?: ReturnType<typeof LayerManager.renderLayer>;
    private timeout?: NodeJS.Timeout;
    private root?: Root;
    private politeRegion?: HTMLDivElement;
    private assertiveRegion?: HTMLDivElement;
    private isPaused: boolean = false;
    private currentOptions: ToastOptions | null = null;

    constructor() {
        if (typeof document === 'undefined') return;

        this.element = document?.createElement('div');
        this.ariaLiveContainer = document?.createElement('div');
        this.ariaLiveContainer.id = 'nf-toast-container';
        document.body.appendChild(this.ariaLiveContainer);

        this.politeRegion = createAriaLiveRegion('nf-toast-polite-region', 'polite');
        this.assertiveRegion = createAriaLiveRegion('nf-toast-assertive-region', 'assertive');
        this.ariaLiveContainer.appendChild(this.politeRegion);
        this.ariaLiveContainer.appendChild(this.assertiveRegion);

        this.setupKeyboardListeners();
    }

    /**
     * Clean up event listeners and DOM elements
     * Call this when the app is tearing down (useful for tests)
     */
    public destroy = () => {
        if (typeof document !== 'undefined') {
            document.removeEventListener('keydown', this.handleKeyDown);
        }
        this.remove();
        if (this.ariaLiveContainer && document.body.contains(this.ariaLiveContainer)) {
            document.body.removeChild(this.ariaLiveContainer);
        }
        this.politeRegion = undefined;
        this.assertiveRegion = undefined;
        this.ariaLiveContainer = undefined;
    };

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
        const region = isAssertive ? this.assertiveRegion : this.politeRegion;

        if (region) {
            region.textContent = '';
            // Add content after delay
            setTimeout(() => {
                if (region) {
                    region.textContent = content;
                }
            }, 200);
        }
    };

    public remove = () => {
        if (this.toast) {
            this.toast[1]();
            if (this.timeout) {
                clearTimeout(this.timeout);
                this.timeout = undefined;
            }
        }
        this.toast = undefined;
        this.currentOptions = null;
        this.isPaused = false;

        setTimeout(() => {
            if (!this.toast && this.root) {
                this.root.unmount();
                this.root = undefined;
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
        if (!this.element) return;

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
        if (!this.root) {
            this.root = createRoot(this.element);
        }
        this.root.render(<Component />);

        this.timeout = setTimeout(() => {
            this.remove();
        }, duration || DEFAULT_DURATION);
    }
}

export default new Toast();
