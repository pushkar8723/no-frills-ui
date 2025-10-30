import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Select } from '../../../src/components/Input';

const meta: Meta<typeof Select> = {
  component: Select,
  title: 'Declarative Components/Select',
  tags: ['!dev', '!autodocs'],
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <Select
        label='Gender'
        required
      >
        <option value="M">Male</option>
        <option value="F">Female</option>
        <option value="T">Transgender</option>
        <option value="N">Don't want to specify</option>
      </Select>
      <Select
        label='Country'
        value='IN'
        disabled
      >
        <option value="IN">India</option>
        <option value="US">America</option>
        <option value="UK">United Kingdom</option>
      </Select>
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `import { Select } from 'no-frills-ui';

// Render
<Select />`,
      },
    },
  },
};

export const Primary: Story = {
  args: {
    label: 'Select Option',
    children: [
      <option key="1" value="1">Option 1</option>,
      <option key="2" value="2">Option 2</option>,
      <option key="3" value="3">Option 3</option>,
    ],
  },
};
