import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { getThemeValue, THEME_NAME } from '../../shared/constants';

const Container = styled.div<PropTypes.InferProps<typeof Group.propTypes>>`
    display: inline-flex;
    border: 1px solid ${getThemeValue(THEME_NAME.BORDER_COLOR)};
    border-radius: 3px;
    margin: 5px;

    /* overrides */
    & button,
    & label {
        margin: 0;
        border: none;
        border-radius: 0;
        border-left: 1px solid ${getThemeValue(THEME_NAME.BORDER_COLOR)};
        box-shadow: none;
        height: 32px;
    }

    & > div button {
        border-left: none;
    }

    & input,
    & select {
        border: none;
        height: 32px;
    }

    & input,
    & select {
        border-radius: 0;
    }

    & input:active,
    & select:active {
        box-shadow: none;
    }

    & > div > span {
        top: 8px;
    }

    /* Handling for first and last child */
    & > *:first-child,
    & > label:first-child input,
    & > label:first-child select,
    & > *:first-child label,
    & > *:first-child input {
        border-left: none;
        border-radius: 2px 0 0 2px;
    }

    & > *:last-child,
    & > label:last-child input,
    & > label:last-child select,
    & > *:last-child label,
    & > *:last-child input {
        border-radius: 0 2px 2px 0;
    }

    /* focus */
    & *:focus,
    & *:focus + span {
        z-index: 1;
    }

    &:focus-within,
    &:hover {
        box-shadow: ${getThemeValue(THEME_NAME.HOVER_SHADOW)};
    }

    ${(props) =>
        props.errorText
            ? `
        border-color: ${getThemeValue(THEME_NAME.ERROR)};

        & > button, & > label {
            border-color: ${getThemeValue(THEME_NAME.ERROR)};
        }
    `
            : ''}
`;

const ErrorContainer = styled.div`
    color: ${getThemeValue(THEME_NAME.ERROR)};
    margin-left: 8px;
    font-size: 12px;
`;

export default function Group(
    props: React.PropsWithChildren<PropTypes.InferProps<typeof Group.propTypes>>,
) {
    return (
        <>
            <Container {...props}>{props.children}</Container>
            {props.errorText && <ErrorContainer>{props.errorText}</ErrorContainer>}
        </>
    );
}

Group.propTypes = {
    /** Error Message for the group */
    errorText: PropTypes.string,
};
