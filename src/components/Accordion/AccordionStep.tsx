import React, { useState } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import PropTypes from 'prop-types';
import { Card } from '../Card';
import { Ellipsis } from '../../shared/styles';
import { FiberManualRecord, ExpandMore } from '../../icons';
import constants from '../../shared/constants';
import { Badge, BADGE_TYPE } from '../Badge';

const Step = styled(Card)<AccordionStepProps & { focused: boolean }>`
    transition: all .6s ease;

    ${props => props.open && `
        margin: 20px 5px;
    `}

    ${props => props.focused && `box-shadow: 0 0 0 4px var(--primary-light, ${constants.PRIMARY_LIGHT});`}
`;

const StepHeader = styled.div<{ open: boolean, disabled: boolean }>`
    padding: 20px 15px;
    display: flex;
    justify-content: space-between;
    
    & input {
        appearance: none;
        margin: 0;
    }

    ${props => props.open ? `
        border-bottom: 1px solid var(--border-light-color, ${constants.BORDER_LIGHT_COLOR});
    ` : ''}

    ${props => props.disabled ? `
        color: ${constants.LIGHT_GREY};
    ` : `
        cursor: pointer;
    `}
`;

const HeaderContainer = styled.div<{ open: boolean, completed: boolean }>`
    display: flex;
    align-items: center;
    min-width: 40px;

    & svg {
        vertical-align: top;
        margin-right: 10px;
        fill: ${props => props.open
            ? `var(--primary, ${constants.PRIMARY})`
            : props.completed 
                ? `var(--success, ${constants.SUCCESS})`
                : constants.LIGHT_GREY};
        transform: ${props => props.open ? 'scale(0.8)' : 'scale(0.6)'};
        transition: all .3s ease;
        min-width: 24px;
    }
`;

const ExpandContainer = styled.div<{ open: boolean }>`
    display: flex;
    align-items: center;

    & svg {
        vertical-align: top;
        margin-right: 10px;
        transition: all .6s ease;
        fill: currentColor;
    }

    ${props => props.open ? `
        & svg {
            transform: rotate(180deg);
        }
    `: ''}
`;

const StepBody = styled.div<{ height: number }>`
    transition: all .6s ease;
    overflow: hidden;
    height: ${ props => props.height || 0}px;
`;

export const AccordionStepBody = styled.div`
    padding: 20px 15px;
`;

export const AccordionStepFooter = styled.div`
    display: flex;
    justify-content: flex-end;
    padding: 10px 15px;
    border-top: 1px solid var(--border-light-color, ${constants.BORDER_LIGHT_COLOR});
`;

export default function AccordionStep(props: React.PropsWithChildren<AccordionStepProps>) {
    const [height, setHeight] = useState(0);
    const [focused, setFocused] = useState(false);
    const { open, disabled, header, errorText, completed, onStepClick } = props;

    const ref = (el?: HTMLDivElement) => setHeight(el?.scrollHeight || 0);

    const toggleFocus = () => {
        setFocused(!focused)
    }

    return(
        <Step {...props} focused={focused} elevated={props.open}>
            <StepHeader open={open} disabled={disabled} onClick={onStepClick}>
                <HeaderContainer open={open} completed={completed}>
                    <input
                        type='checkbox'
                        checked={open}
                        disabled={disabled}
                        onFocus={toggleFocus}
                        onBlur={toggleFocus}
                    />
                    <FiberManualRecord />
                    <Ellipsis>{header}</Ellipsis>
                </HeaderContainer>
                <ExpandContainer open={open}>
                    {errorText && <Badge css={css`margin-right: 15px;`} inline type={BADGE_TYPE.DANGER}>{errorText}</Badge>}
                    <ExpandMore />
                </ExpandContainer>
            </StepHeader>
            <StepBody ref={ref} height={open ? height : 0}>
                {open && props.children}
            </StepBody>
        </Step>
    )
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
}

AccordionStep.defaultProps = {
    completed: false,
    disabled: false
}

type AccordionStepProps = PropTypes.InferProps<typeof AccordionStep.propTypes> & {
    open: boolean,
    completed: boolean,
    onStepClick: () =>  void,
};