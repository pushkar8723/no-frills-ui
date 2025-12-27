import React, { useId } from 'react';
import styled from '@emotion/styled';
import { getThemeValue, THEME_NAME } from '../../shared/constants';

const Container = styled.div<GroupProps>`
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
    & > *:first-of-type,
    & > label:first-of-type input,
    & > label:first-of-type select,
    & > *:first-of-type label,
    & > *:first-of-type input {
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

type GroupProps = React.PropsWithChildren<{
    /** Error Message for the group */
    errorText?: string;
}>;

/**
 * Group Component
 * @param props - Component props
 * @param ref - Ref forwarded to the underlying HTMLDivElement
 */
function GroupComponent(
    props: React.PropsWithChildren<GroupProps>,
    ref: React.Ref<HTMLDivElement>,
) {
    const errorId = useId();

    return (
        <>
            <Container
                {...props}
                ref={ref}
                aria-describedby={props.errorText ? errorId : undefined}
            >
                {props.children}
            </Container>
            {props.errorText && <ErrorContainer id={errorId}>{props.errorText}</ErrorContainer>}
        </>
    );
}

const Group = React.forwardRef<HTMLDivElement, GroupProps>(GroupComponent);
export default Group;
