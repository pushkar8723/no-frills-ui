import styled from '@emotion/styled';

export const Ellipsis = styled.span`
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
`;

export const Header = styled.div`
    padding: 10px 15px;
    line-height: 26px;
    border-bottom: 1px solid var(--border-light-color, #eeeeee);
    font-size: 16px;
    font-weight: bold;
`;

export const Body = styled.div`
    padding: 20px 15px;
    flex: 1;
    overflow: auto;
`;

export const Footer = styled.div`
    padding: 10px 15px;
    border-top: 1px solid var(--border-light-color, #eeeeee);
    display: flex;
    justify-content: flex-end;
`;
