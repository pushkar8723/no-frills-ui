import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Chip } from '../../../src/components/Chip';

const meta: Meta<typeof Chip> = {
  component: Chip,
  title: 'Declarative Components/Chip',
  tags: ['!dev', '!autodocs'],
};

export default meta;
type Story = StoryObj<typeof Chip>;

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <Chip label='Apple' />
      <Chip label='Banana' />
      <Chip label='Cherry' />
      <Chip label='Mango' />
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `import { Chip } from 'no-frills-ui';

// Render
<Chip label='Chip 1' />`,
      },
    },
  },
};

export const Primary: Story = {
  args: {
    label: 'Chip Label',
  },
};
