import styled from '@emotion/styled';
import { THEME_NAME, getThemeValue } from '../../shared/constants';

export default styled.button`
    border: 1px solid ${getThemeValue(THEME_NAME.PRIMARY)};
    background-color: ${getThemeValue(THEME_NAME.PRIMARY)};
    color: ${getThemeValue(THEME_NAME.TEXT_COLOR_LIGHT)};
    border-radius: 5px;
    height: 32px;
    min-width: 100px;
    font-size: 14px;
    text-align: center;
    padding: 0 12px;
    cursor: pointer;
    margin: 5px;
    position: relative;

    & svg {
        vertical-align: middle;
        height: 24px;
        width: 24px;
        fill: currentColor;
        margin-left: -6px;
    }

    &:enabled:hover {
        box-shadow: ${getThemeValue(THEME_NAME.HOVER_SHADOW)};
    }

    &:focus {
        box-shadow: 0 0 0 4px ${getThemeValue(THEME_NAME.PRIMARY_LIGHT)};
    }

    &:disabled {
        border: 1px solid ${getThemeValue(THEME_NAME.BORDER_LIGHT_COLOR)};
        background-color: ${getThemeValue(THEME_NAME.DISABLED_BACKGROUND)};
        color: ${getThemeValue(THEME_NAME.DISABLED)};
    }
`;
