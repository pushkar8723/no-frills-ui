import { PropsWithChildren } from 'react';

type TabProps = PropsWithChildren<{
    /** Name of the tab. This shown in the tab's button */
    name: string;
    /**
     * If the tab is disabled
     * @default false
     */
    disabled?: boolean;
}>;

const Tab = (props: TabProps) => {
    const { children } = props;
    return <>{children}</>;
};

export default Tab;
