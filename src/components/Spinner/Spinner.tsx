import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { getThemeValue, THEME_NAME } from '../../shared/constants';

const SpinnerDiv = styled.div<SpinnerProp>`
    border: 4px solid ${getThemeValue(THEME_NAME.PRIMARY)};
    border-top: 4px solid ${getThemeValue(THEME_NAME.BORDER_LIGHT_COLOR)};
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
    const { label, ...rest } = props;
    return (
        <SpinnerDiv
            {...rest}
            role="status"
            aria-label={label}
            aria-live="polite"
            aria-busy="true"
        />
    );
}

type SpinnerProp = PropTypes.InferProps<typeof Spinner.propTypes>;

Spinner.propTypes = {
    /** Spinner's size */
    size: PropTypes.number,
    /** Accessible label for screen readers */
    label: PropTypes.string,
};

Spinner.defaultProps = {
    size: 30,
    label: 'Loading',
};

export default Spinner;
