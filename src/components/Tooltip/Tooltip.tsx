import React, { useId } from 'react';
import styled from '@emotion/styled';
import { getThemeValue, THEME_NAME } from '../../shared/constants';

export enum TOOLTIP_POSITION {
    TOP = 'TOP',
    BOTTOM = 'BOTTOM',
    LEFT = 'LEFT',
    RIGHT = 'RIGHT',
}

const positionStyle = {
    [TOOLTIP_POSITION.LEFT]: `
        left: 0;
        transform: translateX(-50%) scale(0);
    `,
    [TOOLTIP_POSITION.RIGHT]: `
        right: 0;
        transform: translateX(50%) scale(0);
    `,
    [TOOLTIP_POSITION.TOP]: `
        top: 0;
        transform: translateY(-10px) scale(0);
    `,
    [TOOLTIP_POSITION.BOTTOM]: `
        bottom: 0;
        transform: translateY(10px) scale(0);
    `,
};

const positionHoverStyle = {
    [TOOLTIP_POSITION.LEFT]: `
        transform: translateX(-100%) scale(1);
    `,
    [TOOLTIP_POSITION.RIGHT]: `
        transform: translateX(100%) scale(1);
    `,
    [TOOLTIP_POSITION.TOP]: `
        transform: translateY(-25px) scale(1);
    `,
    [TOOLTIP_POSITION.BOTTOM]: `
        transform: translateY(25px) scale(1);
    `,
};

const TooltipDiv = styled.div<{ position: TOOLTIP_POSITION }>`
    position: absolute;
    background-color: ${getThemeValue(THEME_NAME.TOOLTIP_COLOR)};
    padding: 5px;
    color: ${getThemeValue(THEME_NAME.TEXT_COLOR_LIGHT)};
    border-radius: 3px;
    transition: transform 0.3s ease;
    font-size: 12px;
    z-index: 1;
    ${(props) => positionStyle[props.position]}
`;

const TooltipContainer = styled.div<{ position: TOOLTIP_POSITION }>`
    position: relative;
    display: inline-flex;
    justify-content: center;
    align-items: center;

    &:hover ${TooltipDiv}, &:focus-within ${TooltipDiv} {
        ${(props) => positionHoverStyle[props.position]}
    }
`;

type TooltipProps = React.PropsWithChildren<{
    /** Text to show in the tooltip */
    tooltipText: string | React.ReactNode;
    /**
     * Position of the tooltip
     * @default TOOLTIP_POSITION.BOTTOM
     */
    position?: TOOLTIP_POSITION;
}> &
    React.HTMLAttributes<HTMLDivElement>;

/**
 * Tooltip Component
 * @param props - Component props
 * @param ref - Ref forwarded to the underlying HTMLDivElement
 */
function TooltipComponent(props: TooltipProps, ref: React.Ref<HTMLDivElement>) {
    const { children, position = TOOLTIP_POSITION.BOTTOM, ...rest } = props;
    const tooltipId = useId();

    // Clone the child to inject aria-describedby and tabIndex if possible
    const trigger = React.isValidElement(children)
        ? React.cloneElement(
              children as React.ReactElement<{ tabIndex?: number; 'aria-describedby'?: string }>,
              {
                  'aria-describedby': tooltipId,
                  tabIndex:
                      (
                          children as React.ReactElement<{
                              tabIndex?: number;
                              'aria-describedby'?: string;
                          }>
                      ).props &&
                      typeof (
                          children as React.ReactElement<{
                              tabIndex?: number;
                              'aria-describedby'?: string;
                          }>
                      ).props.tabIndex !== 'undefined'
                          ? (
                                children as React.ReactElement<{
                                    tabIndex?: number;
                                    'aria-describedby'?: string;
                                }>
                            ).props.tabIndex
                          : 0,
              },
          )
        : children;

    return (
        <TooltipContainer {...rest} ref={ref} position={position}>
            {trigger}
            <TooltipDiv id={tooltipId} aria-hidden="true" role="tooltip" position={position}>
                {rest.tooltipText as React.ReactNode}
            </TooltipDiv>
        </TooltipContainer>
    );
}

const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(TooltipComponent);
export default Tooltip;
