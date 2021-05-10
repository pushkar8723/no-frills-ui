import styled from '@emotion/styled';
import constants from '../../shared/constants';

export default styled.button`
    border: 1px solid var(--border-color, ${constants.BORDER_COLOR});
    border-radius: 5px;
    height: 32px;
    min-width: 100px;
    font-size: 14px;
    text-align: center;
    padding: 0 12px;
    cursor: pointer;
    color: inherit;
    background-color: var(--background, ${constants.BACKGROUND});
    text-overflow: ellipsis;
    white-space: nowrap;
    margin: 5px;
    position: relative;

    & svg {
        vertical-align: middle;
        height: 24px;
        width: 24px;
        margin-left: -6px;
        fill: currentColor;
    }

    &:enabled:hover {
        border-color: var(--primary, ${constants.PRIMARY});
        color: var(--primary, ${constants.PRIMARY});
    }

    &:focus {
        border-color: var(--primary, ${constants.PRIMARY});
        box-shadow: 0 0 0 4px var(--primary-light, ${constants.PRIMARY_LIGHT});
    }

    &:disabled {
        background-color: var(--border-light-color, ${constants.BORDER_LIGHT_COLOR});
        border-color: var(--light-grey, ${constants.LIGHT_GREY});
        color: var(--disabled, ${constants.DISABLED});
    }
`;
