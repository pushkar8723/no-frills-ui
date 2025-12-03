import { PropsWithChildren } from 'react';
import PropTypes from 'prop-types';

const Tab = (props: PropsWithChildren<{ name: string; disabled: boolean }>) => {
    const { children } = props;
    return <>{children}</>;
};

Tab.propTypes = {
    /** Name of the tab. This shown in the tab's button */
    name: PropTypes.string.isRequired,
    /** If the tab is disabled */
    disabled: PropTypes.bool,
};

Tab.defaultProps = {
    disabled: false,
};

export default Tab;
