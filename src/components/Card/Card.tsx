import styled from '@emotion/styled';

interface CardExtraProps {
    elevated?: boolean
}

const Card = styled.div<CardExtraProps>`
    border-radius: 10px;
    background-color: var(--background, #fff);
    ${props => props.elevated
        ? `box-shadow: var(--modal-shadow, 0px 8px 17px 2px rgba(0,0,0,0.14),
            0px 3px 14px 2px rgba(0,0,0,0.12),
            0px 5px 5px -3px rgba(0,0,0,0.2));`
        : `box-shadow: var(--shadow, 0px 1px 3px 0px rgba(0,0,0,0.1),
            0px 1px 2px 0px rgba(0,0,0,0.06));`
    }
    margin: 5px;
`;

export default Card;
