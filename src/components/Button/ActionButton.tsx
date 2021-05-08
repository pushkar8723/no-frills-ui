import styled from '@emotion/styled';
import constants from '../../shared/constants';

export default styled.button`
    border: 1px solid var(--primary, ${constants.PRIMARY});
    background-color: var(--primary, ${constants.PRIMARY});
    color: #fff;
    border-radius: 5px;
    height: 32px;
    min-width: 100px;
    font-size: 14px;
    text-align: center;
    padding: 0 12px;
    cursor: pointer;
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

    &:enabled:hover {
        box-shadow: var(--hover-shadow, ${constants.HOVER_SHADOW});
    }

    &:focus {
        box-shadow: 0 0 0 4px var(--primary-light, ${constants.PRIMARY_LIGHT});
    }

    &:disabled {
        border: 1px solid ${constants.LIGHT_GREY};
        background-color: var(--border-light-color, ${constants.BORDER_LIGHT_COLOR});
        color: var(--disabled, ${constants.DISABLED});
    }
`;
