import styled from '@emotion/styled';
import constants from '../../shared/constants';

export default styled.label`
    height: 32px;
    background-color: ${constants.DISABLED_BACKGROUND};
    padding: 0 4px;
    line-height: 32px;
    min-width: 24px;
    text-align: center;
    color: ${constants.BORDER_COLOR};

    & > svg {
        height: 24px;
        width: 24px;
        vertical-align: middle;
        fill: currentColor;
    }
`;