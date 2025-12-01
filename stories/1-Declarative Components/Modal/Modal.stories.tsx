import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Card, Modal } from '../../../src/components';
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
    <Card style={{ background: 'linear-gradient(to right, #00b09b, #96c93d)', padding: '20px'}}>
      <ModalDemo />
    </Card>
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
