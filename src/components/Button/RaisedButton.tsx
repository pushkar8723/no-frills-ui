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
    transform: translateY(-2px);
    box-shadow: var(--hover-shadow, ${constants.HOVER_SHADOW});
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    margin: 5px;

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
    }

    &:disabled {
        background-color: ${constants.BORDER_LIGHT_COLOR};
        border-color: ${constants.LIGHT_GREY};
        color: ${constants.DISABLED};
    }

    &:active {
        transform: translateY(0);
        box-shadow: var(--shadow, ${constants.SHADOW});
    }
`;
