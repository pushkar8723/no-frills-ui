import styled from '@emotion/styled';
import { getThemeValue, THEME_NAME } from '../../shared/constants';

export default styled.button`
    min-width: 100px;
    font-size: 14px;
    text-align: center;
    height: 32px;
    cursor: pointer;
    background-color: transparent;
    border: none;
    color: ${getThemeValue(THEME_NAME.PRIMARY)};
    padding: 0 12px;
    margin: 5px;
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;

    & svg {
        vertical-align: middle;
        height: 24px;
        width: 24px;
        fill: currentColor;
        margin-left: -6px;
    }

    &:enabled:hover,
    &:focus {
        text-decoration: underline;
    }

    &:disabled {
        border-color: ${getThemeValue(THEME_NAME.BORDER_COLOR)};
        color: ${getThemeValue(THEME_NAME.DISABLED)};
    }
`;
