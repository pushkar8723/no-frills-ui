import styled from '@emotion/styled';
import { Card } from '../Card';
import { NOTIFICATION_POSITION, NOTIFICATION_TYPE, NotificationOptions } from './Notification';

const getEntryAnimation = (position: NOTIFICATION_POSITION) => {
    switch(position) {
        case NOTIFICATION_POSITION.TOP_LEFT:
        case NOTIFICATION_POSITION.BOTTOM_LEFT:
            return 'in-left';
        default:
            return 'in-right';
    }
}

const getExitAnimation = (position: NOTIFICATION_POSITION) => {
    switch(position) {
        case NOTIFICATION_POSITION.TOP_LEFT:
        case NOTIFICATION_POSITION.BOTTOM_LEFT:
            return 'out-left';
        default:
            return 'out-right';
    }
}

const getBorderColor = (type: NOTIFICATION_TYPE) => {
    switch(type) {
        case NOTIFICATION_TYPE.SUCCESS:
            return 'var(--success-light, #80eac6)';
        case NOTIFICATION_TYPE.DANGER:
            return 'var(--error-light, #f1a5a5)';
        case NOTIFICATION_TYPE.WARNING:
            return 'var(--warning-light, #ffba00)';
        default:
            return 'var(--info-light, #64baff)';
    }
}

const getTitleColor = (type: NOTIFICATION_TYPE) => {
    switch(type) {
        case NOTIFICATION_TYPE.SUCCESS:
            return 'var(--success, #22d295)';
        case NOTIFICATION_TYPE.DANGER:
            return 'var(--error, #d63b3b)';
        case NOTIFICATION_TYPE.WARNING:
            return 'var(--warning, #cc9500)';
        case NOTIFICATION_TYPE.INFO:
            return 'var(--info, #2283d2)';
    }
}

const getTypeStyle = (type: NOTIFICATION_TYPE) => {
    switch(type) {
        case NOTIFICATION_TYPE.INFO:
            return 'color:  var(--info, #2283d2)';
        case NOTIFICATION_TYPE.SUCCESS:
            return 'color: var(--success, #22d295)';
        case NOTIFICATION_TYPE.DANGER:
            return 'color: var(--error, #d63b3b)';
        case NOTIFICATION_TYPE.WARNING:
            return 'color: var(--warning, #cc9500)';
    }
}

interface NoticeProp extends NotificationOptions {
    position: NOTIFICATION_POSITION,
}

export const Container = styled.div<{ position: NOTIFICATION_POSITION }>`
    display: flex;
    flex-direction: ${props =>
        (
            props.position === NOTIFICATION_POSITION.TOP_LEFT ||
            props.position === NOTIFICATION_POSITION.TOP_RIGHT
        ) ? 'column' : 'column-reverse'};
`;

export const Notice = styled(Card)<NoticeProp>`
    border-radius: 3px;
    border-left: 4px solid ${props => getBorderColor(props.type)};
    width: 300px;
    display: flex;
    padding: 0 5px 5px 0;
    overflow: hidden;
    animation: ${props => getEntryAnimation(props.position)} .6s ease;
    
    & svg {
        fill: currentColor;
        vertical-align: middle;
        width: 20px;
        height: 20px;
    }

    &.leave {
        animation: ${props => getExitAnimation(props.position)} .6s;
    }

    @keyframes in-right {
        from {
            transform: translateX(100%);
            max-height: 0;
            opacity: 0;
        }

        to {
            transform: translateX(0%);
            max-height: 150px;
            opacity: 1;
        }
    }

    @keyframes out-right {
        to {
            transform: translateX(100%);
            max-height: 0;
            opacity: 0;
        }

        from {
            transform: translateX(0%);
            max-height: 100px;
            opacity: 1;
        }
    }

    @keyframes in-left {
        from {
            transform: translateX(-100%);
            max-height: 0;
            opacity: 0;
        }

        to {
            transform: translateX(0%);
            max-height: 150px;
            opacity: 1;
        }
    }

    @keyframes out-left {
        to {
            transform: translateX(-100%);
            max-height: 0;
            opacity: 0;
        }

        from {
            transform: translateX(0%);
            max-height: 100px;
            opacity: 1;
        }
    }
`;

export const Title = styled.div<{ type: NOTIFICATION_TYPE }>`
    padding: 5px 0;
    font-size: 14px;
    color: ${props => getTitleColor(props.type)};
    display: flex;
    align-items: center;
`;

export const FillParent = styled.div`
    flex: 1;
`;

export const CloseButton = styled.button`
    background-color: transparent;
    border: none;
    padding: none;
    cursor: pointer;

    &:focus {
        box-shadow: 0 0 0 3px var(--primary-light, #64baff);
        border-radius: 3px;
    }
`;

export const Body = styled.div`
    padding: 5px 5px 5px 0;
    font-size: 14px;
`;

export const IconContainer = styled.div<{ type: NOTIFICATION_TYPE }>`
    padding: 6px 10px;
    ${props => getTypeStyle(props.type)};
`;

export const Footer = styled.div`
    display: flex;
    justify-content: flex-end;
    padding: 0 5px;
`;
