import React, { useState, Children, cloneElement } from 'react';
import PropTypes from 'prop-types';

function Accordion(props: AccordionProps & { children: any }) {
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
                return cloneElement(child, {
                    open: active === index,
                    onStepClick: onStepClick(index, child.props.disabled),
                });
            })}
        </>
    );
}

type AccordionProps = PropTypes.InferProps<typeof Accordion.propTypes>;

Accordion.propTypes = {
    /** Currently opened step */
    active: PropTypes.number,
    /** Handler for click event on a step */
    onStepClick: PropTypes.func,
};

Accordion.defaultProps = {
    active: -1,
};

export default Accordion;
