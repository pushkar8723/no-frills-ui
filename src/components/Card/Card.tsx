import styled from '@emotion/styled';
import { THEME_NAME, getThemeValue } from '../../shared/constants';

export interface CardExtraProps {
    elevated?: boolean;
}

const Card = styled.div<CardExtraProps>`
    border-radius: 10px;
    background-color: ${getThemeValue(THEME_NAME.BACKGROUND)};
    ${(props) =>
        props.elevated
            ? `box-shadow: ${getThemeValue(THEME_NAME.MODAL_SHADOW)};`
            : `box-shadow: ${getThemeValue(THEME_NAME.SHADOW)};`}
    margin: 5px;
    overflow: auto;
    position: relative;
`;

export default Card;
