import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Card } from '../../../src/components/Card';
import { Dummy } from '../../resources/Dummy';

const meta: Meta<typeof Card> = {
    component: Card,
    title: 'Declarative Components/Card',
    tags: ['!dev', '!autodocs'],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Variants: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '16px' }}>
            <Card>
                <Dummy>Card 1</Dummy>
            </Card>
            <Card elevated>
                <Dummy>Card 2</Dummy>
            </Card>
            <Card>
                <Dummy>Card 3</Dummy>
            </Card>
            <Card elevated>
                <Dummy>Card 4</Dummy>
            </Card>
        </div>
    ),
    parameters: {
        docs: {
            source: {
                code: `<Card>
  <Dummy>Card 1</Dummy>
</Card>
<Card elevated>
  <Dummy>Card 2</Dummy>
</Card>
<Card>
  <Dummy>Card 3</Dummy>
</Card>
<Card elevated>
  <Dummy>Card 4</Dummy>
</Card>`,
            },
        },
    },
};

export const Primary: Story = {
    render: (args) => (
        <Card {...args}>
            <Dummy>Card Content</Dummy>
        </Card>
    ),
    args: {
        elevated: true,
    },
};
