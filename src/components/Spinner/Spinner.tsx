import React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';

const SpinnerDiv = styled.div<SpinnerProp>`
    border: 4px solid var(--primary, #2283d2);
    border-top: 4px solid #f2f2f2;
    border-radius: 50%;
    width: ${props => props.size}px;
    height: ${props => props.size}px;
    margin: 0 auto;
    animation: spin 1s linear infinite;

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;

function Spinner(props: SpinnerProp) {
    return <SpinnerDiv {...props} />
}

type SpinnerProp = PropTypes.InferProps<typeof Spinner.propTypes>;

Spinner.propTypes = {
    /** Spinner's size */
    size: PropTypes.number
}

Spinner.defaultProps = {
    size: 30,
};

export default Spinner;
