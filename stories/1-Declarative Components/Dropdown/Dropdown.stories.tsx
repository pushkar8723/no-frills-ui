import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Dropdown } from '../../../src/components/Input';
import { MenuItem } from '../../../src/components/Menu';
import { Card } from '../../../src/components/Card';

const meta: Meta<typeof Dropdown> = {
  component: Dropdown,
  title: 'Declarative Components/Dropdown',
  tags: ['!dev', '!autodocs'],
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

export const Variants: Story = {
  render: () => (
    <Card style={{ overflow: 'visible', padding: '16px' }}>
      <form style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <Dropdown label='Choose a fruit' required>
          <MenuItem value='apple'>Apple</MenuItem>
          <MenuItem value='banana'>Banana</MenuItem>
          <MenuItem value='mango'>Mango</MenuItem>
          <MenuItem value='orange'>Orange</MenuItem>
        </Dropdown>
        <Dropdown label='Choose a fruit' required multiSelect>
          <MenuItem value='apple'>Apple</MenuItem>
          <MenuItem value='banana'>Banana</MenuItem>
          <MenuItem value='mango'>Mango</MenuItem>
          <MenuItem value='orange'>Orange</MenuItem>
        </Dropdown>
        <Dropdown label='Choose a fruit' disabled>
          <MenuItem value='apple'>Apple</MenuItem>
          <MenuItem value='banana'>Banana</MenuItem>
          <MenuItem value='mango'>Mango</MenuItem>
          <MenuItem value='orange'>Orange</MenuItem>
        </Dropdown>
      </form>
    </Card>
  ),
  parameters: {
    docs: {
      source: {
        code: `import { Dropdown, MenuItem } from 'no-frills-ui';

//render
<Dropdown label='Choose a fruit' required multiSelect>
    <MenuItem value='apple'>Apple</MenuItem>
    <MenuItem value='banana'>Banana</MenuItem>
    <MenuItem value='mango'>Mango</MenuItem>
    <MenuItem value='orange'>Orange</MenuItem>
</Dropdown>`,
      },
    },
  },
};

export const Primary: Story = {
  args: {
    label: 'Choose an option',
    children: [
      <MenuItem key="1" value='option1'>Option 1</MenuItem>,
      <MenuItem key="2" value='option2'>Option 2</MenuItem>,
      <MenuItem key="3" value='option3'>Option 3</MenuItem>,
    ],
  },
};
