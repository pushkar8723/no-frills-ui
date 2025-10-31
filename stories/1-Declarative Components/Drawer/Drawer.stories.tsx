import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Drawer } from '../../../src/components';
import DrawerDemo from '../../resources/DrawerDemo';
import { Card } from '../../../src/components/Card';

const meta: Meta = {
  component: Drawer as any,
  title: 'Declarative Components/Drawer',
  tags: ['!dev', '!autodocs'],
};

export default meta;
type Story = StoryObj;

export const Demo: Story = {
  render: () => (
    <Card style={{ background: 'linear-gradient(to right, #00b09b, #96c93d)', padding: '20px'}}>
      <DrawerDemo />
    </Card>
  ),
};

export const Primary: Story = {
  // @ts-ignore - This is for Controls only
  render: (args) => <Drawer {...args} />,
};
