import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Drawer } from '../../../src/components';
import { Card } from '../../../src/components/Card';
import DrawerDemo from '../../resources/DrawerDemo';

const meta: Meta = {
    component: Drawer as never,
    title: 'Declarative Components/Drawer',
    tags: ['!dev', '!autodocs'],
};

export default meta;
type Story = StoryObj;

export const Demo: Story = {
    render: () => (
        <Card
            style={{ background: 'linear-gradient(to right, #00b09b, #96c93d)', padding: '20px' }}
        >
            <DrawerDemo />
        </Card>
    ),
};

export const Primary: Story = {
    // @ts-expect-error - This is for Controls only
    render: (args) => <Drawer {...args} />,
};
