import React from 'react';
import ReactDOM from 'react-dom';
import styled from '@emotion/styled';
import constants from '../../shared/constants';
import LayerManager, { LAYER_POSITION } from '../../shared/LayerManager';
import { Card } from '../Card';

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
            return `var(--info, ${constants.INFO})`;
        case TOAST_TYPE.SUCCESS:
            return `var(--success, ${constants.SUCCESS})`;
        case TOAST_TYPE.WARNING:
            return `var(--warning, ${constants.WARNING})`;
        case TOAST_TYPE.DANGER:
            return `var(--error, ${constants.ERROR})`;
        case TOAST_TYPE.NORMAL:
            return `var(--toast, ${constants.TOAST})`;
    }
};

const ToastContainer = styled(Card)<{ type: TOAST_TYPE }>`
    box-sizing: border-box;
    border-radius: 3px;
    padding: 12px;
    background-color: ${(props) => getBackgroundColor(props.type)};
    color: #fff;
    margin: 20px;
    font-size: 14px;
    line-height: 20px;
    transform: translateY(100%);
    transition: transform 0.3s ease;
    width: 344px;
    display: flex;
    align-items: center;

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
    color: var(--primary, ${constants.PRIMARY_LIGHT});
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

    constructor() {
        this.element = document?.createElement('div');
    }

    public remove = () => {
        if (this.toast) {
            this.toast[1]();
            clearTimeout(this.timeout);
            this.timeout = null;
        }
        this.toast = null;

        setTimeout(() => {
            if (!this.toast) {
                ReactDOM.unmountComponentAtNode(this.element);
            }
        }, 300);
    };

    /**
     * Pause toast when user is hovering over it.
     *
     * @param id
     */
    public pause = () => {
        clearTimeout(this.timeout);
    };

    /**
     * Restart the removal of toast.
     *
     * @param id
     */
    public resume = (options: ToastOptions) => () => {
        this.timeout = setTimeout(() => {
            this.remove();
        }, options.duration || DEFAULT_DURATION);
    };

    public add(options: ToastOptions) {
        const { text, buttonText, buttonClick, duration, type = TOAST_TYPE.NORMAL } = options;
        this.remove();
        this.toast = LayerManager.renderLayer({
            exitDelay: 300,
            closeOnEsc: false,
            closeOnOverlayClick: false,
            alwaysOnTop: true,
            position: LAYER_POSITION.BOTTOM_LEFT,
            component: (
                <ToastContainer
                    {...options}
                    type={type}
                    elevated
                    onMouseEnter={this.pause}
                    onMouseLeave={this.resume(options)}
                >
                    <TextContainer>{text}</TextContainer>
                    {buttonText && (
                        <CloseContainer onClick={buttonClick} type="button">
                            {buttonText}
                        </CloseContainer>
                    )}
                </ToastContainer>
            ),
        });
        const Component = this.toast[0];
        ReactDOM.render(<Component />, this.element);

        this.timeout = setTimeout(() => {
            this.remove();
        }, duration || DEFAULT_DURATION);
    }
}

export default new Toast();
