import React from 'react';
import styled from '@emotion/styled';
import { THEME_NAME, getThemeValue } from '../../shared/constants';

type CardExtraProps = {
    /** Shows a shadow around the card to show elevation */
    elevated?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

const StyledCard = styled.div<CardExtraProps>`
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

function CardComponent(props: CardExtraProps, ref: React.Ref<HTMLDivElement>) {
    return <StyledCard {...props} ref={ref} />;
}

const Card = React.forwardRef<HTMLDivElement, CardExtraProps>(CardComponent);

export default Card;
