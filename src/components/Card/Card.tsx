import styled from '@emotion/styled';
import constants from '../../shared/constants';

export interface CardExtraProps {
    elevated?: boolean
}

const Card = styled.div<CardExtraProps>`
    border-radius: 10px;
    background-color: var(--background, ${constants.BACKGROUND});
    ${props => props.elevated
        ? `box-shadow: var(--modal-shadow, ${constants.MODAL_SHADOW});`
        : `box-shadow: var(--shadow, ${constants.SHADOW});`
    }
    margin: 5px;
`;

export default Card;
