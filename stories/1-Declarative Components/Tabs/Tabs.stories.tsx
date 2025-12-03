import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Tabs, Tab } from '../../../src/components/Tabs';

const meta: Meta<typeof Tabs> = {
    component: Tabs,
    title: 'Declarative Components/Tabs',
    tags: ['!dev', '!autodocs'],
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Demo: Story = {
    render: () => (
        <Tabs active={1}>
            <Tab name="Tab 1">This is tab 1 content.</Tab>
            <Tab name="Tab 2">This is tab 2 content.</Tab>
            <Tab name="Tab 3" disabled>
                This is tab 3 content.
            </Tab>
        </Tabs>
    ),
    parameters: {
        docs: {
            source: {
                code: `<Tabs active={1}>
      <Tab name="Tab 1">
        This is tab 1 content.
      </Tab>
      <Tab name="Tab 2">
        This is tab 2 content.
      </Tab>
      <Tab name="Tab 3" disabled>
        This is tab 3 content.
      </Tab>
    </Tabs>`,
            },
        },
    },
};

export const TabsProps: Story = {
    render: (args) => <Tabs {...args} />,
};

export const TabProps: Story = {
    // @ts-expect-error - This is for Controls only
    render: (args) => <Tab {...args} />,
};
