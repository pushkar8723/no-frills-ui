import React from 'react';
import styled from '@emotion/styled';
import { THEME_NAME, getThemeValue } from '../../shared/constants';

type CardProps = {
    /** Shows a shadow around the card to show elevation */
    elevated?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

const StyledCard = styled.div<CardProps>`
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

/**
 * Card Component
 * @param props - Component props
 * @param ref - Ref forwarded to the underlying HTMLAr
 */
function CardComponent(props: CardProps, ref: React.Ref<HTMLDivElement>) {
    return <StyledCard {...props} ref={ref} />;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(CardComponent);
export default Card;
