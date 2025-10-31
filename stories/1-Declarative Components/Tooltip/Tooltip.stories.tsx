import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Tooltip, TOOLTIP_POSITION, Button, Input } from '../../../src/components';

const meta: Meta<typeof Tooltip> = {
  component: Tooltip,
  title: 'Declarative Components/Tooltip',
  tags: ['!dev', '!autodocs'],
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Positions: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', padding: '40px' }}>
      <Tooltip tooltipText='Now you see me' position={TOOLTIP_POSITION.TOP}>
        <Button>
          Hover over me
        </Button>
      </Tooltip>
      <Tooltip tooltipText='Now you see me' position={TOOLTIP_POSITION.RIGHT}>
        <Button>
          Hover over me
        </Button>
      </Tooltip>
      <Tooltip tooltipText='Now you see me'>
        <Button>
          Hover over me
        </Button>
      </Tooltip>
      <Tooltip tooltipText='Now you see me' position={TOOLTIP_POSITION.LEFT}>
        <Button>
          Hover over me
        </Button>
      </Tooltip>
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `import { Tooltip, TOOLTIP_POSITION, } from 'no-frills-ui';

// Render
<Tooltip tooltipText='Now you see me' position={TOOLTIP_POSITION.RIGHT}>
    <button>
        Hover over me
    </button>
</Tooltip>`,
      },
    },
  },
};

export const RichTooltip: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', padding: '40px' }}>
      <Tooltip tooltipText='Enter your full name here' position={TOOLTIP_POSITION.RIGHT}>
        <Input label='Enter Name'/>
      </Tooltip>
      <Tooltip tooltipText={<strong style={{ color: 'lightgreen' }}>Bad Tooltip</strong>}>
        <a>
          Hover over me
        </a>
      </Tooltip>
    </div>
  ),
};

export const Primary: Story = {
  // @ts-ignore - This is for Controls only
  render: (args) => <Tooltip {...args}><Button>Hover Me</Button></Tooltip>,
};
