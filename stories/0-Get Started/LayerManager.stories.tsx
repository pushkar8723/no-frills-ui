import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import LayerDemo from '../resources/LayerDemo';
import { Card } from '../../src/components';

const meta: Meta<typeof LayerDemo> = {
  component: LayerDemo,
  title: 'Get Started/Layer Manager',
  tags: ['!dev', '!autodocs'],
};

export default meta;
type Story = StoryObj<typeof LayerDemo>;

export const Demo: Story = {
    render: () => (
      <Card style={{
        display: 'flex', justifyContent: 'space-between', padding: '30px 20px',
        background: 'linear-gradient(to right, #00b09b, #96c93d)', flexWrap: 'wrap',
        overflow: 'visible'
      }}>
        <LayerDemo />
      </Card>
    ),
};
