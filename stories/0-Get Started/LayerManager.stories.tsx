import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import LayerDemo from '../resources/LayerDemo';

const meta: Meta<typeof LayerDemo> = {
  component: LayerDemo,
  title: 'Get Started/Layer Manager',
  tags: ['!dev', '!autodocs'],
};

export default meta;
type Story = StoryObj<typeof LayerDemo>;

export const Demo: Story = {
    render: () => <LayerDemo />,
};
