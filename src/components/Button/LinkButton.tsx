import styled from '@emotion/styled';

export default styled.button`
    min-width: 100px;
    font-size: 14px;
    text-align: center;
    height: 32px;
    cursor: pointer;
    background-color: transparent;
    border: none;
    color: var(--primary, #2283d2);
    padding: 0 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    margin: 5px;

    &:enabled:hover, &:focus {
        text-decoration: underline;
    }

    &[disabled] {
        color: #aaa;
    }
`;
