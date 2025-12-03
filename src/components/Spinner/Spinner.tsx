import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import constants from '../../shared/constants';

const SpinnerDiv = styled.div<SpinnerProp>`
    border: 4px solid var(--primary, ${constants.PRIMARY});
    border-top: 4px solid var(--border-light-color, ${constants.BORDER_LIGHT_COLOR});
    border-radius: 50%;
    width: ${(props) => props.size}px;
    height: ${(props) => props.size}px;
    margin: 0 auto;
    animation: spin 1s linear infinite;

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
`;

function Spinner(props: SpinnerProp) {
    return <SpinnerDiv {...props} />;
}

type SpinnerProp = PropTypes.InferProps<typeof Spinner.propTypes>;

Spinner.propTypes = {
    /** Spinner's size */
    size: PropTypes.number,
};

Spinner.defaultProps = {
    size: 30,
};

export default Spinner;
