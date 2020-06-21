import styled from '@emotion/styled';

export default styled.button`
    border: 1px solid var(--border-color, #555);
    border-radius: 5px;
    height: 32px;
    min-width: 100px;
    font-size: 14px;
    text-align: center;
    padding: 0 12px;
    cursor: pointer;
    color: inherit;
    background-color: var(--background, #fff);
    transform: translateY(-2px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    margin: 5px;

    & svg {
        vertical-align: middle;
        height: 24px;
        width: 24px;
        margin-left: -6px;
    }

    &:enabled:hover {
        border-color: var(--primary, #2283d2);
        color: var(--primary, #2283d2);
    }

    &:enabled:hover svg {
        fill: var(--primary, #2283d2);
    }

    &:focus {
        border-color: var(--primary, #2283d2);
    }

    &:disabled {
        background-color: #eee;
        border-color: #ccc;
        color: #777;
    }

    &:disabled svg {
        fill: #777;
    }

    &:active {
        transform: translateY(0);
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    }
`;
