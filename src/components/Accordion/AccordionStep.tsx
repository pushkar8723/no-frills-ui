import React, { useState } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { Card } from '../Card';
import { Ellipsis } from '../../shared/styles';
import { FiberManualRecord, ExpandMore } from '../../icons';

const Step = styled(Card)<AccordionStepProps & { focused: boolean }>`
    transition: all .6s ease;

    ${props => props.open && `
        box-shadow: 0px 8px 17px 2px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12), 0px 5px 5px -3px rgba(0,0,0,0.2);
        margin: 20px 5px;
    `}

    ${props => props.focused && 'box-shadow: 0 0 0 4px var(--primary-light, #64baff);'}
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
        border-bottom: 1px solid var(--border-light-color, #eee);
    ` : ''}

    ${props => props.disabled ? `
        color: #ccc;
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
            ? 'var(--primary, #2283d2)'
            : props.completed 
                ? 'var(--success, #22d295)'
                : '#ccc'};
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

const ErrorContainer = styled.span`
    background-color: var(--error, #d63b3b);
    color: #fff;
    padding: 3px 10px;
    font-size: 12px;
    margin-right: 20px;
    border-radius: 10px;
    white-space: nowrap;
`;

export const AccordionStepBody = styled.div`
    padding: 20px 15px;
`;

export const AccordionStepFooter = styled.div`
    display: flex;
    justify-content: flex-end;
    padding: 10px 15px;
    border-top: 1px solid var(--border-light-color, #eee);
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
        <Step {...props} focused={focused}>
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
                    {errorText && <ErrorContainer>{errorText}</ErrorContainer>}
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