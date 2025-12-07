import styled from '@emotion/styled';
import { getThemeValue, THEME_NAME } from '../../shared/constants';

export default styled.button`
    border: 1px solid ${getThemeValue(THEME_NAME.BORDER_COLOR)};
    border-radius: 5px;
    height: 32px;
    font-size: 14px;
    text-align: center;
    padding: 0 3px;
    cursor: pointer;
    color: inherit;
    background-color: ${getThemeValue(THEME_NAME.BACKGROUND)};
    text-overflow: ellipsis;
    white-space: nowrap;
    margin: 5px;
    position: relative;

    & svg {
        vertical-align: middle;
        height: 24px;
        width: 24px;
        fill: currentColor;
    }

    &:enabled:hover {
        border-color: ${getThemeValue(THEME_NAME.PRIMARY)};
        color: ${getThemeValue(THEME_NAME.PRIMARY)};
    }

    &:focus {
        border-color: ${getThemeValue(THEME_NAME.PRIMARY)};
        box-shadow: 0 0 0 4px ${getThemeValue(THEME_NAME.PRIMARY_LIGHT)};
    }

    &:disabled {
        background-color: ${getThemeValue(THEME_NAME.BORDER_LIGHT_COLOR)};
        border-color: ${getThemeValue(THEME_NAME.LIGHT_GREY)};
        color: ${getThemeValue(THEME_NAME.DISABLED)};
    }

    &:disabled > svg {
        fill: ${getThemeValue(THEME_NAME.DISABLED)};
    }
`;
