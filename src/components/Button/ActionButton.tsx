import styled from 'styled-components';

export default styled.button`
    border: 1px solid var(--primary, #2283d2);
    background-color: var(--primary, #2283d2);
    color: #fff;
    border-radius: 5px;
    height: 30px;
    min-width: 100px;
    font-size: 14px;
    text-align: center;
    padding: 0 12px;
    cursor: pointer;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    margin: 5px;

    &:enabled:hover {
        box-shadow: 0 2px 4px #aaa;
    }

    &:focus {
        box-shadow: 0 0 0 3px var(--primary-light, #64baff);
    }

    &[disabled] {
        border: 1px solid #ccc;
        background-color: #eee;
        color: #777;
    }
`;
