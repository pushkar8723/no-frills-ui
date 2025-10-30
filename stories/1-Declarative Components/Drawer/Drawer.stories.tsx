import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Drawer } from '../../../src/components';
import DrawerDemo from '../../resources/DrawerDemo';

const meta: Meta<typeof Drawer> = {
  component: Drawer,
  title: 'Declarative Components/Drawer',
  tags: ['!dev', '!autodocs'],
};

export default meta;
type Story = StoryObj<typeof Drawer>;

export const Demo: Story = {
  render: () => (
    <div style={{ background: 'linear-gradient(to right, #00b09b, #96c93d)', padding: '20px', minHeight: '200px' }}>
      <DrawerDemo />
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `import { useState } from 'react';
import { Drawer, DrawerHeader, DrawerBody, DrawerFooter, DRAWER_POSITION } from 'no-frills-ui';

const [open, setOpen] = useState(false);

<Drawer open={open} onClose={() => setOpen(false)} position={DRAWER_POSITION.LEFT}>
    <DrawerHeader>Header goes here</DrawerHeader>
    <DrawerBody>
        Here goes body.
    </DrawerBody>
    <DrawerFooter>
        And footer over here.
    </DrawerFooter>
</Drawer>`,
      },
    },
  },
};

export const Primary: Story = {
  // @ts-ignore - This is for Controls only
  render: (args) => <Drawer {...args} />,
};
