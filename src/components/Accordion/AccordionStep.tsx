import React, { useState, useId, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import { FiberManualRecord, ExpandMore } from '../../icons';
import { THEME_NAME, getThemeValue } from '../../shared/constants';
import { Ellipsis } from '../../shared/styles';
import { Badge, BADGE_TYPE } from '../Badge';
import { Card } from '../Card';

const Step = styled(Card)<{ open?: boolean; completed?: boolean }>`
    transition: all 0.6s ease;
    overflow: visible;
    display: flow-root;

    ${(props) => props.open && `margin: 20px 5px;`}
`;

const StepHeader = styled.button<{ open?: boolean; disabled?: boolean }>`
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
    ${(props) => props.open && `border-radius: 10px 10px 0 0;`}

    ${(props) => props.disabled && `color: ${getThemeValue(THEME_NAME.DISABLED)};`}
`;

const HeaderContainer = styled.div<{ open?: boolean; completed?: boolean }>`
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

const ExpandContainer = styled.div<{ open?: boolean }>`
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

const AccordionBadge = styled(Badge)`
    margin-right: 15px;
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

/** Props for `AccordionStep` component */
interface AccordionStepProps {
    /**
     * If the step has been marked as completed
     * @default false
     */
    completed?: boolean;
    /** If the step is disabled
     * @default false
     */
    disabled?: boolean;
    /** Header content for the step */
    header: React.ReactNode;
    /** Error text to display as a badge in the header */
    errorText?: React.ReactNode;
    /** If the step is expanded */
    open?: boolean;
    /** Click handler for the step header */
    onStepClick?: React.MouseEventHandler<HTMLButtonElement>;
}

/**
 * AccordionStep Component
 * @param props - Component props
 * @param ref - Ref forwarded to the underlying HTMLDivElement
 */
function AccordionStepComponent(
    props: React.PropsWithChildren<AccordionStepProps> & React.HTMLAttributes<HTMLDivElement>,
    ref: React.Ref<HTMLDivElement>,
) {
    const [height, setHeight] = useState(0);
    const {
        open,
        disabled = false,
        header,
        errorText,
        completed = false,
        onStepClick,
        children,
        ...restProps
    } = props;

    // Generate unique IDs for ARIA relationships
    const headerId = useId();
    const regionId = useId();

    const contentRef = useRef<HTMLDivElement | null>(null);

    // Measure content height when `open` or children change.
    useEffect(() => {
        const el = contentRef.current;
        setHeight(el?.scrollHeight || 0);
    }, [open, children]);

    return (
        <Step {...restProps} ref={ref} open={open} elevated={open} completed={completed}>
            <StepHeader
                type="button"
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
                        <AccordionBadge inline type={BADGE_TYPE.DANGER}>
                            {errorText}
                        </AccordionBadge>
                    )}
                    <ExpandMore aria-hidden="true" />
                </ExpandContainer>
            </StepHeader>
            <StepBody
                ref={contentRef}
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

const AccordionStep = React.forwardRef<
    HTMLDivElement,
    React.PropsWithChildren<AccordionStepProps> & React.HTMLAttributes<HTMLDivElement>
>(AccordionStepComponent);

export default AccordionStep;
