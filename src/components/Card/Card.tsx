import React from 'react';
import styled from '@emotion/styled';
import { THEME_NAME, getThemeValue } from '../../shared/constants';

type CardProps = {
    /** Shows a shadow around the card to show elevation */
    elevated?: boolean;
} & React.HTMLAttributes<HTMLElement>;

const StyledCard = styled.article<CardProps>`
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
function CardComponent(props: CardProps, ref: React.Ref<HTMLElement>) {
    return <StyledCard {...props} ref={ref} />;
}

const Card = React.forwardRef<HTMLElement, CardProps>(CardComponent);
export default Card;
