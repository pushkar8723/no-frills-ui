import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Card } from '../../../src/components/Card';
import { Menu, MenuItem } from '../../../src/components/Menu';

const meta: Meta<typeof Menu> = {
  component: Menu,
  title: 'Declarative Components/Menu',
  tags: ['!dev', '!autodocs'],
};

export default meta;
type Story = StoryObj<typeof Menu>;

export const Variants: Story = {
  render: () => (
    <div style={{ background: 'linear-gradient(to right, #00b09b, #96c93d)', padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
      <Card>
        <Menu>
          <MenuItem value='apple'>Apple</MenuItem>
          <MenuItem value='orange'>Orange</MenuItem>
          <MenuItem value='mango'>Mango</MenuItem>
          <MenuItem value='Banana'>Banana</MenuItem>
        </Menu>
      </Card>
      <Card>
        <Menu multiSelect>
          <MenuItem value='apple'>Apple</MenuItem>
          <MenuItem value='orange'>Orange</MenuItem>
          <MenuItem value='mango'>Mango</MenuItem>
          <MenuItem value='Banana'>Banana</MenuItem>
        </Menu>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `import { Menu, MenuItem } from 'no-frills-ui';

//render
<Menu>
    <MenuItem value='apple'>Apple</MenuItem>
    <MenuItem value='orange'>Orange</MenuItem>
    <MenuItem value='mango'>Mango</MenuItem>
    <MenuItem value='Banana'>Banana</MenuItem>
</Menu>`,
      },
    },
  },
};

export const MenuProps: Story = {
  args: {
    children: [
      <MenuItem key="1" value='option1'>Option 1</MenuItem>,
      <MenuItem key="2" value='option2'>Option 2</MenuItem>,
      <MenuItem key="3" value='option3'>Option 3</MenuItem>,
    ],
  },
};

export const MenuItemProps: Story = {
  // @ts-ignore - This is for Controls only
  render: (args) => <MenuItem {...args}>Item</MenuItem>,
};
