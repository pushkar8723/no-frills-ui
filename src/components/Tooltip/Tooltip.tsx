import React, { useId } from 'react';
import PropTypes from 'prop-types';
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

export default function Tooltip(props: React.PropsWithChildren<TooltipProps>) {
    const { children, position, ...rest } = props;
    const tooltipId = useId();

    // Clone the child to inject aria-describedby and tabIndex if possible
    const trigger = React.isValidElement(children)
        ? React.cloneElement(children as React.ReactElement, {
              'aria-describedby': tooltipId,
              tabIndex:
                  children.props && typeof children.props.tabIndex !== 'undefined'
                      ? children.props.tabIndex
                      : 0,
          })
        : children;

    return (
        <TooltipContainer position={position} {...rest}>
            {trigger}
            <TooltipDiv id={tooltipId} aria-hidden="true" role="tooltip" position={position}>
                {rest.tooltipText as React.ReactNode}
            </TooltipDiv>
        </TooltipContainer>
    );
}

type TooltipProps = PropTypes.InferProps<typeof Tooltip.propTypes>;

Tooltip.propTypes = {
    /** Text to show in the tooltip */
    tooltipText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
    /** Position of the tooltip */
    position: PropTypes.oneOf([
        TOOLTIP_POSITION.TOP,
        TOOLTIP_POSITION.LEFT,
        TOOLTIP_POSITION.RIGHT,
        TOOLTIP_POSITION.BOTTOM,
    ]),
};

Tooltip.defaultProps = {
    position: TOOLTIP_POSITION.BOTTOM,
};
