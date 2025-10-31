import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Toggle } from '../../../src/components/Input';

const meta: Meta<typeof Toggle> = {
  component: Toggle,
  title: 'Declarative Components/Toggle',
  tags: ['!dev', '!autodocs'],
};

export default meta;
type Story = StoryObj<typeof Toggle>;

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
      <Toggle label='Mobile' />
      <Toggle label='Electron'/>
      <Toggle label='Desktop' disabled checked />
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `<Toggle label='Mobile' />
      <Toggle label='Electron'/>
      <Toggle label='Desktop' disabled checked />`,
      },
    },
  },
};

export const Primary: Story = {
  args: {
    label: 'Toggle Label',
  },
};
