import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Modal } from '../../../src/components';
import ModalDemo from '../../resources/ModalDemo';

const meta: Meta = {
  component: Modal as any,
  title: 'Declarative Components/Modal',
  tags: ['!dev', '!autodocs'],
};

export default meta;
type Story = StoryObj;

export const Demo: Story = {
  render: () => (
    <ModalDemo />
  ),
  parameters: {
    docs: {
      source: {
        code: ``,
      },
    },
  },
};

export const Primary: Story = {
  // @ts-ignore - This is for Controls only
  render: (args) => <Modal {...args} />,
};
