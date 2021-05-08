import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import constants from '../../shared/constants';

const Container = styled.div<PropTypes.InferProps<typeof Group.propTypes>>`
    display: inline-flex;
    border: 1px solid var(--border-color, ${constants.BORDER_COLOR});
    border-radius: 3px;
    margin: 5px;

    /* overrides */
    & > button, & > label {
        margin: 0;
        border: none;
        border-radius: 0;
        border-left: 1px solid var(--border-color, ${constants.BORDER_COLOR});
        box-shadow: none;
        height: 32px;
    }

    & input, & select {
        border: none;
        height: 32px;
    }

    & input, & select {
        border-radius: 0;
    }

    & input:active, & select:active {
        box-shadow: none;
    }

    /* Handling for first and last child */
    & > *:first-child, & > label:first-child input,
    & > label:first-child select {
        border-left: none;
        border-radius: 2px 0 0  2px;
    }

    & > *:last-child, & > label:last-child input,
    & > label:last-child select {
        border-radius: 0 2px 2px 0;
    }

    /* focus */
    & *:focus, & *:focus + span {
        z-index: 1;
    }

    &:focus-within, &:hover {
        box-shadow: var(--hover-shadow, ${constants.HOVER_SHADOW});
    }

    ${props => props.errorText ? `
        border-color: var(--error, ${constants.ERROR});

        & > button, & > label {
            border-color: var(--error, ${constants.ERROR});
        }
    `: ''}
`;

const ErrorContainer = styled.div`
    color: var(--error, ${constants.ERROR});
    margin-left: 8px;
    font-size: 12px;
`;

export default function Group(props: React.PropsWithChildren<PropTypes.InferProps<typeof Group.propTypes>>) {
    return (
        <>
            <Container {...props}>
                {props.children}
            </Container>
            { props.errorText && <ErrorContainer>{props.errorText}</ErrorContainer> }
        </>
    )
}

Group.propTypes = {
    /** Error Message for the group */
    errorText: PropTypes.string,
}
