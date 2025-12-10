import React, { useState, useId } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { FiberManualRecord, ExpandMore } from '../../icons';
import { THEME_NAME, getThemeValue } from '../../shared/constants';
import { Ellipsis } from '../../shared/styles';
import { Badge, BADGE_TYPE } from '../Badge';
import { Card } from '../Card';

const Step = styled(Card)<AccordionStepProps>`
    transition: all 0.6s ease;
    overflow: visible;

    ${(props) => props.open && `margin: 20px 5px;`}
`;

const StepHeader = styled.button<{ open: boolean; disabled: boolean }>`
    padding: 20px 15px;
    display: flex;
    justify-content: space-between;
    background: none;
    border: none;
    border-radius: 10px;
    width: 100%;
    font-size: inherit;
    color: ${getThemeValue(THEME_NAME.TEXT_COLOR_DARK)};

    &:focus-visible {
        box-shadow: 0 0 0 4px ${getThemeValue(THEME_NAME.PRIMARY_LIGHT)};
    }

    & input {
        appearance: none;
        margin: 0;
    }

    ${(props) =>
        props.open && `border-bottom: 1px solid ${getThemeValue(THEME_NAME.BORDER_LIGHT_COLOR)};`}

    ${(props) => props.disabled && `color: ${getThemeValue(THEME_NAME.DISABLED)};`}
`;

const HeaderContainer = styled.div<{ open: boolean; completed: boolean }>`
    display: flex;
    align-items: center;
    min-width: 40px;

    & svg {
        vertical-align: top;
        margin-right: 10px;
        fill: ${(props) =>
            props.open
                ? getThemeValue(THEME_NAME.PRIMARY)
                : props.completed
                  ? getThemeValue(THEME_NAME.SUCCESS)
                  : getThemeValue(THEME_NAME.LIGHT_GREY)};
        transform: ${(props) => (props.open ? 'scale(0.8)' : 'scale(0.6)')};
        transition: all 0.3s ease;
        min-width: 24px;
    }
`;

const ExpandContainer = styled.div<{ open: boolean }>`
    display: flex;
    align-items: center;

    & svg {
        vertical-align: top;
        margin-right: 10px;
        transition: all 0.6s ease;
        fill: currentColor;
    }

    ${(props) => (props.open ? `& svg { transform: rotate(180deg); }` : '')}
`;

const StepBody = styled.div<{ height: number }>`
    transition: all 0.6s ease;
    overflow: hidden;
    height: ${(props) => props.height || 0}px;
`;

export const AccordionStepBody = styled.div`
    padding: 20px 15px;
`;

export const AccordionStepFooter = styled.div`
    display: flex;
    justify-content: flex-end;
    padding: 10px 15px;
    border-top: 1px solid ${getThemeValue(THEME_NAME.BORDER_LIGHT_COLOR)};
`;

export default function AccordionStep(props: React.PropsWithChildren<AccordionStepProps>) {
    const [height, setHeight] = useState(0);
    const { open, disabled, header, errorText, completed, onStepClick, children, ...restProps } =
        props;

    // Generate unique IDs for ARIA relationships
    const headerId = useId();
    const regionId = useId();

    const ref = (el?: HTMLDivElement) => setHeight(el?.scrollHeight || 0);

    return (
        <Step {...restProps} open={open} elevated={open} completed={completed}>
            <StepHeader
                open={open}
                disabled={disabled}
                onClick={onStepClick}
                aria-expanded={open ? 'true' : 'false'}
                aria-controls={regionId}
                id={headerId}
            >
                <HeaderContainer open={open} completed={completed}>
                    <FiberManualRecord aria-hidden="true" />
                    <Ellipsis>{header}</Ellipsis>
                </HeaderContainer>
                <ExpandContainer open={open}>
                    {errorText && (
                        <Badge
                            css={css`
                                margin-right: 15px;
                            `}
                            inline
                            type={BADGE_TYPE.DANGER}
                        >
                            {errorText}
                        </Badge>
                    )}
                    <ExpandMore aria-hidden="true" />
                </ExpandContainer>
            </StepHeader>
            <StepBody
                ref={ref}
                height={open ? height : 0}
                role="region"
                id={regionId}
                aria-labelledby={headerId}
                aria-hidden={open ? 'false' : 'true'}
            >
                {open && children}
            </StepBody>
        </Step>
    );
}

AccordionStep.propTypes = {
    /** Header text for the step */
    header: PropTypes.string.isRequired,
    /** Error text for the step */
    errorText: PropTypes.string,
    /** If steps has been marked as completed */
    completed: PropTypes.bool,
    /** If the step is disabled */
    disabled: PropTypes.bool,
};

AccordionStep.defaultProps = {
    completed: false,
    disabled: false,
};

type AccordionStepProps = PropTypes.InferProps<typeof AccordionStep.propTypes> & {
    open?: boolean;
    completed: boolean;
    onStepClick?: () => void;
};
