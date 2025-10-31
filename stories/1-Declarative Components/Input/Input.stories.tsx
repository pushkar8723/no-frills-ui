import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Input } from '../../../src/components/Input';

const meta: Meta<typeof Input> = {
  component: Input,
  title: 'Declarative Components/Input',
  tags: ['!dev', '!autodocs'],
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Variants: Story = {
  render: () => (
    <form style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
      <Input
        label='Name'
        type='text'
        minLength={4}
        style={{ width: '300px' }}
        placeholder='Enter your full name'
        required
      />
      <Input
        label='Email'
        type='email'
        required
      />
      <Input
        label='Website'
        type='url'
      />
      <Input
        label='Country'
        type='text'
        value='India'
        disabled
      />
    </form>
  ),
  parameters: {
    docs: {
      source: {
        code: `import { Input } from 'no-frills-ui';

// Render
<Input />`,
      },
    },
  },
};

export const Primary: Story = {
  args: {
    label: 'Input Label',
    placeholder: 'Enter text...',
  },
};
