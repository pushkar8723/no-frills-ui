import styled from '@emotion/styled';
import constants from '../../shared/constants';

export default styled.button`
    min-width: 100px;
    font-size: 14px;
    text-align: center;
    height: 32px;
    cursor: pointer;
    background-color: transparent;
    border: none;
    color: var(--primary, ${constants.PRIMARY});
    padding: 0 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    margin: 5px;

    & svg {
        vertical-align: middle;
        height: 24px;
        width: 24px;
        fill: currentColor;
        margin-left: -6px;
    }

    &:enabled:hover, &:focus {
        text-decoration: underline;
    }

    &:disabled {
        border-color: ${constants.BORDER_COLOR};
        color: ${constants.DISABLED_BORDER};
    }
`;
