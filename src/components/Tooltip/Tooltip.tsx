import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

export enum TOOLTIP_POSITION {
    TOP = 'TOP',
    BOTTOM = 'BOTTOM',
    LEFT = 'LEFT',
    RIGHT = 'RIGHT'
};

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
    background-color: var(--tooltip-color, rgba(0,0,0,0.7));
    padding: 5px;
    color: #fff;
    border-radius: 3px;
    transition: transform .3s ease;
    font-size: 12px;
    z-index: 1;
    ${props => positionStyle[props.position]}
`;

const TooltipContainer = styled.div<{ position: TOOLTIP_POSITION }>`
    position: relative;
    display: inline-flex;
    justify-content: center;
    align-items: center;

    &:hover ${TooltipDiv} {
        ${props => positionHoverStyle[props.position]}
    }
`;

export default function Tooltip(props: React.PropsWithChildren<TooltipProps>) {
    const { children, position, ...rest } = props;

    return (
        <TooltipContainer position={position} {...rest}>
            {children}
            <TooltipDiv position={position}>{rest.tooltipText}</TooltipDiv>
        </TooltipContainer>
    );
}

type TooltipProps = PropTypes.InferProps<typeof Tooltip.propTypes>;

Tooltip.propTypes = {
    /** Text to show in the tooltip */
    tooltipText: PropTypes.string.isRequired,
    /** Position of the tooltip */
    position: PropTypes.oneOf([
        TOOLTIP_POSITION.TOP,
        TOOLTIP_POSITION.LEFT,
        TOOLTIP_POSITION.RIGHT,
        TOOLTIP_POSITION.BOTTOM
    ]),
}

Tooltip.defaultProps = {
    position: TOOLTIP_POSITION.BOTTOM
}
