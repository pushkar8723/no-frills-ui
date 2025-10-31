import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Checkbox } from '../../../src/components/Input';

const meta: Meta<typeof Checkbox> = {
  component: Checkbox,
  title: 'Declarative Components/Checkbox',
  tags: ['!dev', '!autodocs'],
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
      <Checkbox label='Android' />
      <Checkbox label='iOS' />
      <Checkbox label='Desktop' indeterminate checked disabled />
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `<Checkbox label='Android' />
<Checkbox label='iOS' />
<Checkbox label='Desktop' indeterminate checked disabled />`,
      },
    },
  },
};

export const Primary: Story = {
  args: {
    label: 'Checkbox Label',
  },
};
