import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Spinner } from '../../../src/components/Spinner';

const meta: Meta<typeof Spinner> = {
  component: Spinner,
  title: 'Declarative Components/Spinner',
  tags: ['!dev', '!autodocs'],
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Sizes: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <Spinner size={40} />
            <Spinner />
            <Spinner size={20} />
            <Spinner size={10} />
        </div>
    ),
    parameters: {
        docs: {
            source: {
                code: `<Spinner size={40} />
<Spinner />
<Spinner size={20} />
<Spinner size={10} />`
            }
        }
    }
};

// Props documentation story
export const Primary: Story = {
    args: {},
};
