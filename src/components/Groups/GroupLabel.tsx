import styled from '@emotion/styled';
import { getThemeValue, THEME_NAME } from '../../shared/constants';

export default styled.label`
    height: 32px;
    background-color: ${getThemeValue(THEME_NAME.DISABLED_BACKGROUND)};
    padding: 0 4px;
    line-height: 32px;
    min-width: 24px;
    text-align: center;
    color: ${getThemeValue(THEME_NAME.BORDER_COLOR)};

    & > svg {
        height: 24px;
        width: 24px;
        vertical-align: middle;
        fill: currentColor;
    }
`;
