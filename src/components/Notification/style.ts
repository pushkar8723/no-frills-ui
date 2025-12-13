import styled from '@emotion/styled';
import { getThemeValue, THEME_NAME } from '../../shared/constants';
import { Card } from '../Card';
import { NOTIFICATION_POSITION, NOTIFICATION_TYPE, NotificationOptions } from './types';

const getEntryAnimation = (position: NOTIFICATION_POSITION) => {
    switch (position) {
        case NOTIFICATION_POSITION.TOP_LEFT:
        case NOTIFICATION_POSITION.BOTTOM_LEFT:
            return 'in-left';
        default:
            return 'in-right';
    }
};

const getExitAnimation = (position: NOTIFICATION_POSITION) => {
    switch (position) {
        case NOTIFICATION_POSITION.TOP_LEFT:
        case NOTIFICATION_POSITION.BOTTOM_LEFT:
            return 'out-left';
        default:
            return 'out-right';
    }
};

const getBorderColor = (type?: NOTIFICATION_TYPE) => {
    switch (type) {
        case NOTIFICATION_TYPE.SUCCESS:
            return getThemeValue(THEME_NAME.SUCCESS_LIGHT);
        case NOTIFICATION_TYPE.DANGER:
            return getThemeValue(THEME_NAME.ERROR_LIGHT);
        case NOTIFICATION_TYPE.WARNING:
            return getThemeValue(THEME_NAME.WARNING_LIGHT);
        default:
            return getThemeValue(THEME_NAME.INFO_LIGHT);
    }
};

const getTitleColor = (type: NOTIFICATION_TYPE) => {
    switch (type) {
        case NOTIFICATION_TYPE.SUCCESS:
            return getThemeValue(THEME_NAME.SUCCESS);
        case NOTIFICATION_TYPE.DANGER:
            return getThemeValue(THEME_NAME.ERROR);
        case NOTIFICATION_TYPE.WARNING:
            return getThemeValue(THEME_NAME.WARNING);
        case NOTIFICATION_TYPE.INFO:
            return getThemeValue(THEME_NAME.INFO);
    }
};

const getTypeStyle = (type: NOTIFICATION_TYPE) => {
    switch (type) {
        case NOTIFICATION_TYPE.INFO:
            return `color: ${getThemeValue(THEME_NAME.INFO)}`;
        case NOTIFICATION_TYPE.SUCCESS:
            return `color: ${getThemeValue(THEME_NAME.SUCCESS)}`;
        case NOTIFICATION_TYPE.DANGER:
            return `color: ${getThemeValue(THEME_NAME.ERROR)}`;
        case NOTIFICATION_TYPE.WARNING:
            return `color: ${getThemeValue(THEME_NAME.WARNING)}`;
    }
};

interface NoticeProp extends NotificationOptions {
    position: NOTIFICATION_POSITION;
}

export const Container = styled.div<{ position: NOTIFICATION_POSITION }>`
    display: flex;
    flex-direction: ${(props) =>
        props.position === NOTIFICATION_POSITION.TOP_LEFT ||
        props.position === NOTIFICATION_POSITION.TOP_RIGHT
            ? 'column'
            : 'column-reverse'};
`;

export const Notice = styled(Card)<NoticeProp>`
    position: relative;
    border-radius: 3px;
    border-left: 4px solid ${(props) => getBorderColor(props.type)};
    width: 300px;
    display: flex;
    padding: 0 5px 5px 0;
    overflow: hidden;
    animation: ${(props) => getEntryAnimation(props.position)} 0.6s ease;

    & svg {
        fill: currentColor;
        vertical-align: middle;
        width: 20px;
        height: 20px;
    }

    &.leave {
        animation: ${(props) => getExitAnimation(props.position)} 0.6s;
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
    color: ${(props) => getTitleColor(props.type)};
    display: flex;
    align-items: center;
`;

export const FillParent = styled.div`
    flex: 1;
`;

export const CloseButton = styled.button`
    position: absolute;
    background-color: transparent;
    border: none;
    padding: 0;
    top: 4px;
    right: 4px;
    cursor: pointer;
    color: ${getThemeValue(THEME_NAME.TEXT_COLOR_DARK)};

    &:focus {
        box-shadow: 0 0 0 3px ${getThemeValue(THEME_NAME.PRIMARY_LIGHT)};
        border-radius: 3px;
    }
`;

export const Body = styled.div`
    padding: 5px 5px 5px 0;
    font-size: 14px;
`;

export const IconContainer = styled.div<{ type: NOTIFICATION_TYPE }>`
    padding: 6px 10px;
    ${(props) => getTypeStyle(props.type)};
`;

export const Footer = styled.div`
    display: flex;
    justify-content: flex-end;
    padding: 0 5px;
`;

export const VisuallyHidden = styled.span`
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
`;
