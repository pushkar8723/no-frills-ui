import { useState, Children, cloneElement, PropsWithChildren, isValidElement } from 'react';

function Accordion(props: PropsWithChildren<AccordionProps>) {
    const [active, setActive] = useState(props.active);

    const onStepClick = (index: number, disabled: boolean) => () => {
        if (disabled) {
            return;
        }

        const newIndex = index !== active ? index : -1;
        if (props.onStepClick) {
            props.onStepClick(newIndex);
        } else {
            setActive(newIndex);
        }
    };

    return (
        <>
            {Children.map(props.children, (child, index) => {
                if (!isValidElement(child)) {
                    return child;
                }
                return cloneElement(child, {
                    open: active === index,
                    onStepClick: onStepClick(index, child.props.disabled),
                } as Partial<typeof child.props>);
            })}
        </>
    );
}

type AccordionProps = {
    /**
     * Currently opened step
     * @default -1
     */
    active?: number;
    /** Handler for click event on a step */
    onStepClick?: (index: number) => void;
};

export default Accordion;
