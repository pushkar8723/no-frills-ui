import styled from 'styled-components';

export default styled.button`
    border: 1px solid #ccc;
    border-radius: 5px;
    height: 30px;
    min-width: 100px;
    font-size: 14px;
    text-align: center;
    padding: 0 12px;
    cursor: pointer;
    background-color: #fff;
    transform: translateY(-2px);
    box-shadow: 0 3px 7px #ccc;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;

    &:enabled:hover {
        border: 1px solid var(--primary, #2283d2);
        color: var(--primary, #2283d2);
    }

    &:focus {
        border: 1px solid var(--primary, #2283d2);
    }

    &:disabled {
        background-color: #eee;
        color: #777;
    }

    &:active {
        transform: translateY(0);
        box-shadow: 0 1px 3px #888;
    }
`;
