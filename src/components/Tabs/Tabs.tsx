import { useState, Children, useEffect, PropsWithChildren, isValidElement } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { getThemeValue, THEME_NAME } from '../../shared/constants';

const Button = styled.button<{ active: boolean }>`
    background-color: transparent;
    border: none;
    padding: 8px 12px;
    font-size: 14px;
    border-radius: 3px 3px 0 0;
    border-bottom: ${(props) =>
        props.active ? `3px solid ${getThemeValue(THEME_NAME.PRIMARY)}` : 'none'};
    color: ${(props) =>
        props.active
            ? getThemeValue(THEME_NAME.PRIMARY)
            : getThemeValue(THEME_NAME.TEXT_COLOR_DARK)};
    cursor: pointer;

    &:hover,
    &:focus {
        background-color: ${getThemeValue(THEME_NAME.PRIMARY_LIGHTER)};
        border-bottom: ${(props) =>
            props.active
                ? `3px solid ${getThemeValue(THEME_NAME.PRIMARY)}`
                : `3px solid ${getThemeValue(THEME_NAME.PRIMARY)}`};
    }

    &[disabled] {
        background-color: ${getThemeValue(THEME_NAME.DISABLED_BACKGROUND)};
        color: ${getThemeValue(THEME_NAME.DISABLED)};
        border-bottom: 3px solid ${getThemeValue(THEME_NAME.DISABLED_BORDER)};
    }
`;

const ButtonContainer = styled.div`
    border-bottom: 1px solid ${getThemeValue(THEME_NAME.DISABLED_BORDER)};
    margin-bottom: 5px;
    position: relative;
`;

const TabBody = styled.div`
    min-height: 150px;
`;

type ITabsProps = PropsWithChildren<{
    active?: number;
    onChange?: (index: number) => void;
    props?: object;
    bodyProps?: object;
}>;

export default function Tabs(props: ITabsProps) {
    const [active, setActive] = useState(props.active);
    const switchTab = (index: number) => () => setActive(index);
    const { children } = props;

    useEffect(() => {
        setActive(props.active);
        props.onChange?.(props.active);
    }, [props]);

    return (
        <>
            <ButtonContainer {...props.props}>
                {Children.map(children, (child, index) => (
                    <Button
                        type="button"
                        active={active === index}
                        onClick={switchTab(index)}
                        disabled={isValidElement(child) ? child.props.disabled : false}
                    >
                        {isValidElement(child) ? child.props.name : ''}
                    </Button>
                ))}
            </ButtonContainer>
            <TabBody {...props.bodyProps}>{Children.toArray(children)[active]}</TabBody>
        </>
    );
}

Tabs.propTypes = {
    /** Active Tab Index */
    active: PropTypes.number,
    /** OnChange event handler */
    onChange: PropTypes.func,
    /** Props for div that contains tab buttons */
    props: PropTypes.object,
    /** Props for div that contains tab body */
    bodyProps: PropTypes.object,
};

Tabs.defaultProps = {
    active: 0,
};
