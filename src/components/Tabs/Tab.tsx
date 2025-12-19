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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { children, disabled = false } = props;
    return <>{children}</>;
};

export default Tab;
