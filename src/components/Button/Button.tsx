import styled from '@emotion/styled';
import { getThemeValue, THEME_NAME } from '../../shared/constants';

const StyledButton = styled.button`
    border: 1px solid ${getThemeValue(THEME_NAME.BORDER_COLOR)};
    border-radius: 5px;
    height: 32px;
    min-width: 100px;
    font-size: 14px;
    text-align: center;
    padding: 0 12px;
    cursor: pointer;
    color: ${getThemeValue(THEME_NAME.TEXT_COLOR_DARK)};
    background-color: ${getThemeValue(THEME_NAME.BACKGROUND)};
    margin: 5px;
    position: relative;
    display: inline-flex;
    align-items: center;

    & svg {
        vertical-align: middle;
        height: 24px;
        width: 24px;
        margin-left: -6px;
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
        background-color: ${getThemeValue(THEME_NAME.DISABLED_BACKGROUND)};
        border-color: ${getThemeValue(THEME_NAME.LIGHT_GREY)};
        color: ${getThemeValue(THEME_NAME.DISABLED)};
    }
`;

StyledButton.defaultProps = {
    type: 'button',
};

export default StyledButton;
