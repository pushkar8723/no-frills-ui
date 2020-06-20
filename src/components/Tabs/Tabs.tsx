import React, { useState, Children, useEffect } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';

const Button = styled.button<{ active: boolean }>`
    background-color: transparent;
    border: none;
    padding: 8px 12px;
    font-size: 14px;
    border-radius: 3px 3px 0 0;
    border-bottom: ${(props) => (props.active ? '3px solid var(--primary, #2283d2)' : 'none')};
    color: ${(props) => (props.active ? 'var(--primary, #2283d2)' : '#000')};
    cursor: pointer;

    &:hover, &:focus {
        background-color: var(--primary-lighter, #cfe9ff);
        border-bottom: ${(props) => (props.active ? '3px solid var(--primary, #2283d2)' : '3px solid var(--primary, #2283d2)')};
    }

    &[disabled] {
        background-color: #eee;
        color: #777;
        border-bottom: 3px solid #ddd;
    }
`;

const ButtonContainer = styled.div`
    border-bottom: 1px solid #eee;
    margin-bottom: 5px;
`;

const TabBody = styled.div`
    min-height: 150px;
`;

interface ITabsProps {
    active?: number;
    onChange?: (index: number) => void,
    props?: any,
    bodyProps?: any,
    children: any;
};

export default function Tabs(props: ITabsProps) {
    const [active, setActive] = useState(props.active);
    const switchTab = (index: number) => () => setActive(index);
    const { children } = props;

    useEffect(() => {
        setActive(props.active);
        props.onChange && props.onChange(props.active);
    }, [props.active]);

    return (
        <>
            <ButtonContainer {...props.props}>
                {
                    Children.map(children, (child, index) => (
                        <Button
                            type="button"
                            active={active === index}
                            onClick={switchTab(index)}
                            disabled={child.props.disabled}
                        >
                            {child.props.name}
                        </Button>
                    ))
                }
            </ButtonContainer>
            <TabBody {...props.bodyProps}>
                {children[active]}
            </TabBody>
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
}


Tabs.defaultProps ={
    active: 0,
}