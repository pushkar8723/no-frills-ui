import { Children, PropsWithChildren, useState, isValidElement } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { getThemeValue, THEME_NAME } from '../../shared/constants';
import { Ellipsis } from '../../shared/styles';
import { Badge, BADGE_TYPE } from '../Badge';

type StepperProps = PropsWithChildren<{
    active: number;
    onStepClick?: (index: number) => void;
}>;

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
    border-bottom: 1px solid ${getThemeValue(THEME_NAME.BORDER_LIGHT_COLOR)};

    @media (min-width: 601px) {
        &::before {
            position: absolute;
            top: 25px;
            left: 0;
            right: 0;
            height: 2px;
            background-color: ${getThemeValue(THEME_NAME.LIGHT_GREY)};
            content: ' ';
            z-index: 0;
        }
    }

    & > * {
        z-index: 1;
    }
`;

const HeaderButton = styled.button<{ active: boolean }>`
    border: none;
    padding: 16px 24px 16px 16px;
    font-size: 16px;
    cursor: pointer;
    background-color: ${(props) =>
        props.active
            ? getThemeValue(THEME_NAME.BORDER_LIGHT_COLOR)
            : getThemeValue(THEME_NAME.BACKGROUND)};
    font-weight: ${(props) => (props.active ? 'bold' : 'normal')};
    overflow: hidden;
    display: flex;
    align-items: center;

    &:disabled {
        cursor: not-allowed;
        background-color: ${getThemeValue(THEME_NAME.DISABLED_BACKGROUND)};
    }

    &:enabled:hover,
    &:focus {
        background-color: ${getThemeValue(THEME_NAME.PRIMARY_LIGHTER)};
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
    const childrenArray = Children.toArray(children);

    const stepClickHandler = (index: number) => () => {
        setActive(index);
        onStepClick?.(index);
    };

    const getBadgeType = (index: number, completed: boolean, disabled: boolean) => {
        if (disabled) {
            return BADGE_TYPE.DISABLED;
        } else if (index === active) {
            return BADGE_TYPE.PRIMARY;
        } else if (completed) {
            return BADGE_TYPE.SUCCESS;
        }
        return BADGE_TYPE.DISABLED;
    };

    return (
        <Container>
            <Header>
                {Children.map(children, (child, index) => {
                    if (!isValidElement(child)) return null;
                    return (
                        <>
                            <HeaderButton
                                active={index === active}
                                type="button"
                                disabled={child.props.disabled}
                                onClick={stepClickHandler(index)}
                            >
                                <Badge
                                    inline
                                    type={getBadgeType(
                                        index,
                                        child.props.completed,
                                        child.props.disabled,
                                    )}
                                />
                                <Ellipsis>{child.props.name}</Ellipsis>
                            </HeaderButton>
                        </>
                    );
                })}
                <MobileHeader>
                    <span>
                        {isValidElement(childrenArray[active])
                            ? childrenArray[active].props.name
                            : ''}
                    </span>
                    <Badge inline type={BADGE_TYPE.PRIMARY}>
                        {active + 1} of {Children.count(children)}
                    </Badge>
                </MobileHeader>
            </Header>
            {childrenArray[active]}
        </Container>
    );
}

Stepper.propTypes = {
    /** Index of currently active step */
    active: PropTypes.number,
    /** Callback function for click event on a step */
    onStepClick: PropTypes.func,
};

Stepper.defaultProps = {
    active: 0,
};
