import styled from '@emotion/styled';

export default styled.button`
    border: 1px solid #ccc;
    border-radius: 5px;
    height: 32px;
    min-width: 100px;
    font-size: 14px;
    text-align: center;
    padding: 0 12px;
    cursor: pointer;
    background-color: var(--background, #fff);
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    margin: 5px;

    &:enabled:hover {
        border-color: var(--primary, #2283d2);
        color: var(--primary, #2283d2);
    }

    &:focus {
        border-color: var(--primary, #2283d2);
        box-shadow: 0 0 0 4px var(--primary-light, #64baff);
    }

    &:disabled {
        background-color: #eee;
        color: #777;
    }
`;
