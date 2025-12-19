import React from 'react';
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

type SpinnerProp = {
    /**
     * Spinner's size
     * @default 30
     */
    size?: number;
    /**
     * Accessible label for screen readers
     * @default 'Loading'
     */
    label?: string;
};

function SpinnerComponent(props: SpinnerProp, ref: React.Ref<HTMLDivElement>) {
    const { label = 'Loading', size = 30, ...rest } = props;
    return (
        <SpinnerDiv
            {...rest}
            ref={ref}
            size={size}
            role="status"
            aria-label={label || undefined}
            aria-live="polite"
            aria-busy="true"
        />
    );
}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProp>(SpinnerComponent);
export default Spinner;
