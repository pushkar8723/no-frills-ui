import {
    useState,
    Children,
    useEffect,
    PropsWithChildren,
    isValidElement,
    forwardRef,
} from 'react';
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
    /**
     * Active Tab Index
     * @default 0
     */
    active?: number;
    /** OnChange event handler */
    onChange?: (index: number) => void;
    /** Props for div that contains tab body */
    bodyProps?: object;
}>;

function TabsComponent(props: ITabsProps, ref: React.Ref<HTMLDivElement>) {
    const { active: propsActive = 0, onChange, bodyProps, ...rest } = props;
    const [active, setActive] = useState(propsActive);
    const { children } = props;
    const tabRefs = [] as Array<HTMLButtonElement | null>;
    const childrenArray = Children.toArray(children);

    const switchTab = (index: number) => () => {
        setActive(index);
        tabRefs[index]?.focus();
        onChange?.(index);
    };

    // Keyboard navigation for tab buttons
    const onTabKeyDown = (index: number) => (e: React.KeyboardEvent<HTMLButtonElement>) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            const next = (index + 1) % childrenArray.length;
            tabRefs[next]?.focus();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            const prev = (index - 1 + childrenArray.length) % childrenArray.length;
            tabRefs[prev]?.focus();
        }
    };

    useEffect(() => {
        if (propsActive !== undefined) {
            setActive(propsActive);
            onChange?.(propsActive);
        }
    }, [propsActive, onChange]);

    // Generate unique IDs for tabs and panels using sanitized tab name and index
    const sanitize = (str: string) => str.replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase();
    const tabIds = childrenArray.map((child, i) => {
        const name = isValidElement(child) && child.props.name ? child.props.name : `tab${i}`;
        return `nfui-tab-${sanitize(name)}-${i}`;
    });
    const panelIds = childrenArray.map((child, i) => {
        const name = isValidElement(child) && child.props.name ? child.props.name : `tab${i}`;
        return `nfui-tabpanel-${sanitize(name)}-${i}`;
    });

    // Sanity check for active index
    if (active === undefined || active < 0 || active >= childrenArray.length) {
        return null;
    }

    return (
        <>
            <ButtonContainer role="tablist" aria-label="Tabs" ref={ref} {...rest}>
                {childrenArray.map((child, index) => (
                    <Button
                        key={tabIds[index]}
                        ref={(el) => (tabRefs[index] = el)}
                        id={tabIds[index]}
                        type="button"
                        role="tab"
                        aria-selected={active === index}
                        aria-controls={panelIds[index]}
                        tabIndex={active === index ? 0 : -1}
                        active={active === index}
                        onClick={switchTab(index)}
                        onKeyDown={onTabKeyDown(index)}
                        disabled={isValidElement(child) ? child.props.disabled : false}
                        aria-disabled={isValidElement(child) ? child.props.disabled : false}
                    >
                        {isValidElement(child) ? child.props.name : ''}
                    </Button>
                ))}
            </ButtonContainer>
            <TabBody
                id={panelIds[active]}
                role="tabpanel"
                aria-labelledby={tabIds[active]}
                tabIndex={0}
                {...bodyProps}
            >
                {childrenArray[active]}
            </TabBody>
        </>
    );
}

const Tabs = forwardRef(TabsComponent);
export default Tabs;
