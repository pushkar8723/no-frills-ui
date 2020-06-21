import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const Container = styled.div<PropTypes.InferProps<typeof Group.propTypes>>`
    display: inline-flex;
    border: 1px solid var(--border-color, #555);
    border-radius: 3px;

    /* overrides */
    & > button, & > label {
        margin: 0;
        border: none;
        border-radius: 0;
        border-left: 1px solid var(--border-color, #555);
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
    & > *:first-child, & > label:first-child input {
        border-left: none;
        border-radius: 3px 0 0  3px;
    }

    & > *:last-child, & > label:last-child input {
        border-radius: 0 3px 3px 0;
    }

    /* focus */
    & *:focus, & *:focus + span {
        z-index: 1;
    }

    &:focus-within, &:hover {
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }

    ${props => props.errorText ? `
        border-color: var(--error, #d63b3b);

        & > button, & > label {
            border-color: var(--error, #d63b3b);
        }
    `: ''}
`;

const ErrorContainer = styled.div`
    color: var(--error, #d63b3b);
    padding-top: 3px;
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
