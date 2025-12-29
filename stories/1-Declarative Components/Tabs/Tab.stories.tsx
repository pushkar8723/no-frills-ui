import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Tab } from '../../../src/components/Tabs';

const meta: Meta<typeof Tab> = {
    component: Tab,
    title: 'Declarative Components/Tab',
    tags: ['!dev', '!autodocs'],
};

export default meta;
type Story = StoryObj<typeof Tab>;

export const TabProps: Story = {
    render: (args) => <Tab {...args} />,
};
