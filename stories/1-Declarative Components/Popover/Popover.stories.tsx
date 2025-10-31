import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Popover, POPOVER_POSITION, Card } from '../../../src/components';
import PopoverDemo from '../../resources/PopoverDemo';

const meta: Meta<typeof Popover> = {
  component: Popover,
  title: 'Declarative Components/Popover',
  tags: ['!dev', '!autodocs'],
};

export default meta;
type Story = StoryObj<typeof Popover>;

export const Positions: Story = {
  render: () => (
    <Card style={{
      display: 'flex', justifyContent: 'space-between', padding: '30px 20px',
      background: 'linear-gradient(to right, #00b09b, #96c93d)', flexWrap: 'wrap',
      overflow: 'visible'
    }}>
      <PopoverDemo position={POPOVER_POSITION.BOTTOM_LEFT} text='Bottom Left' />
      <PopoverDemo position={POPOVER_POSITION.BOTTOM_RIGHT} text='Bottom Right' />
      <PopoverDemo position={POPOVER_POSITION.TOP_LEFT} text='Top Left' />
      <PopoverDemo position={POPOVER_POSITION.TOP_RIGHT} text='Top Right' />
    </Card>
  ),
  parameters: {
    docs: {
      source: {
        code: `import { useState } from 'react';
import { Popover, POPOVER_POSITION } from 'no-frills-ui';

const [open, setOpen] = useState(false);

// render
<Popover
    open={open}
    position={POPOVER_POSITION.TOP_RIGHT}
    element={<button onClick={() => setOpen(true)}>Open Popover</button>}
>
    Popover Content goes here
</Popover>`,
      },
    },
  },
};

export const Primary: Story = {
  // @ts-ignore - This is for Controls only
  render: (args) => <Popover {...args} />,
};
