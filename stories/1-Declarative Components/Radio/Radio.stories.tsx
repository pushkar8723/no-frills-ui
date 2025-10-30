import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Radio } from '../../../src/components/Input';

const meta: Meta<typeof Radio> = {
  component: Radio,
  title: 'Declarative Components/Radio',
  tags: ['!dev', '!autodocs'],
};

export default meta;
type Story = StoryObj<typeof Radio>;

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Radio label='Mobile' name='platform' />
      <Radio label='Electron' name='platform' />
      <Radio label='Desktop' name='platform' disabled />
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `import { Radio } from 'no-frills-ui';

// Render
<Radio />`,
      },
    },
  },
};

export const Primary: Story = {
  args: {
    label: 'Radio Label',
    name: 'radio-group',
  },
};
