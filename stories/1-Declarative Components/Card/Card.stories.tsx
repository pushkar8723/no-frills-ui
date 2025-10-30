import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
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
    <div style={{ background: 'linear-gradient(to right, #00b09b, #96c93d)', padding: '20px', display: 'flex', gap: '16px' }}>
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
        code: `import { Card } from 'no-frills-ui';

// Render
<Card />`,
      },
    },
  },
};

export const Primary: Story = {
  args: {
    children: <Dummy>Card Content</Dummy>,
  },
};
