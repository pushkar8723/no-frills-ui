import styled from '@emotion/styled';
import { getThemeValue, THEME_NAME } from './constants';

export const Ellipsis = styled.span`
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
`;

export const Header = styled.div`
    padding: 10px 15px;
    line-height: 26px;
    border-bottom: 1px solid ${getThemeValue(THEME_NAME.BORDER_LIGHT_COLOR)};
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
    border-top: 1px solid ${getThemeValue(THEME_NAME.BORDER_LIGHT_COLOR)};
    display: flex;
    justify-content: flex-end;
`;
