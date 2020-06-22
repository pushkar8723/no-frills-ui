import styled from '@emotion/styled';

export default styled.div`
    border: 4px solid var(--primary, #2283d2);
    border-top: 4px solid #f3f3f3;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    margin: 0 auto;
    animation: spin 1s linear infinite;

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`