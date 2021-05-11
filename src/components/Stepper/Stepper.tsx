import React, { Children, useState } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import constants from '../../shared/constants';
import { Badge, BADGE_TYPE } from '../Badge';
import { Ellipsis } from '../../shared/styles';

type StepperProps = {
    active: number;
    onStepClick?: (index: number) => void;
    children: any;
};

const Container = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 400px;
`;

const Header = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    border-bottom: 1px solid var(--border-light-color, ${constants.BORDER_LIGHT_COLOR});

    @media (min-width: 601px) {
        &::before {
            position: absolute;
            top: 25px;
            left: 0;
            right: 0;
            height: 2px;
            background-color: var(--light-grey, ${constants.LIGHT_GREY});
            content: ' ';
            z-index: 0;
        }
    }
    
    & > * {
        z-index: 1;
    }
`;

const HeaderButton = styled.button<{active: boolean}>`
    border: none;
    padding: 16px 24px 16px 16px;
    font-size: 16px;
    cursor: pointer;
    background-color: ${props => props.active
        ? `var(--border-light-color, ${constants.BORDER_LIGHT_COLOR})`
        : `var(--background, ${constants.BACKGROUND})`};
    font-weight: ${props => props.active ? 'bold' : 'normal'};
    overflow: hidden;
    display:flex;
    align-items: center;

    &:disabled {
        cursor: not-allowed;
        background-color: var(--disabled-background, ${constants.DISABLED_BACKGROUND});
    }

    &:enabled:hover, &:focus {
        background-color: var(--primary-light, ${constants.PRIMARY_LIGHTER});
    }

    @media (max-width: 600px) {
        & {
            display: none;
        }
    }
`;

const MobileHeader = styled.div`
    padding: 16px;
    font-size: 16px;
    line-height: 18px;
    align-items: center;
    font-weight: bold;
    flex: 1;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    @media (min-width: 601px) {
        & {
            display: none;
        }
    }
`;

export default function Stepper(props: StepperProps) {
    const [active, setActive] = useState(props.active);
    const { children, onStepClick } = props;

    const stepClickHandler = (index: number) => () => {
        setActive(index);
        onStepClick?.(index);
    }
    
    const getBadgeType = (index: number, completed: boolean, disabled: boolean) => {
        if (disabled) {
            return BADGE_TYPE.DISABLED;
        } else if (index === active) {
            return BADGE_TYPE.PRIMARY;
        } else if (completed) {
            return BADGE_TYPE.SUCCESS;
        }
        return BADGE_TYPE.DISABLED;
    }

    return (
        <Container>
            <Header>
                {Children.map(children, (child, index) => (
                    <>
                    <HeaderButton active={index === active} type='button' disabled={child.props.disabled} onClick={stepClickHandler(index)}>
                        <Badge inline type={getBadgeType(index, child.props.completed, child.props.disabled)} />
                        <Ellipsis>
                            {child.props.name}
                        </Ellipsis>
                    </HeaderButton>
                    </>
                ))}
                <MobileHeader>
                    <span>{children[active].props.name}</span>
                    <Badge inline type={BADGE_TYPE.PRIMARY}>{active + 1} of {children.length}</Badge>
                </MobileHeader>
            </Header>
            {children[active]}
        </Container>
    );
}

Stepper.propTypes = {
    /** Index of currently active step */
    active: PropTypes.number,
    /** Callback function for click event on a step */
    onStepClick: PropTypes.func,
}

Stepper.defaultProps = {
    active: 0,
}
