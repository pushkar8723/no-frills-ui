import styled from '@emotion/styled';

export default styled.button`
    border: 1px solid var(--primary, #2283d2);
    background-color: var(--primary, #2283d2);
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
        box-shadow: 0 2px 4px #aaa;
    }

    &:focus {
        box-shadow: 0 0 0 4px var(--primary-light, #64baff);
    }

    &:disabled {
        border: 1px solid #ccc;
        background-color: #eee;
        color: #777;
    }
`;
