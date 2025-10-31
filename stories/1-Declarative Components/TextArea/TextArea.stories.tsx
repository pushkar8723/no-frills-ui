import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { TextArea } from '../../../src/components/Input';

const meta: Meta<typeof TextArea> = {
  component: TextArea,
  title: 'Declarative Components/TextArea',
  tags: ['!dev', '!autodocs'],
};

export default meta;
type Story = StoryObj<typeof TextArea>;

export const Demo: Story = {
  render: () => (
    <TextArea
      label='Description'
      minLength={100}
      placeholder='Write anything here...'
      required
      style={{ width: '400px' }}
    />
  ),
  parameters: {
    docs: {
      source: {
        code: `import { TextArea } from 'no-frills-ui';

// Render
<TextArea />`,
      },
    },
  },
};

export const Primary: Story = {
  args: {
    label: 'TextArea Label',
    placeholder: 'Enter text...',
  },
};
