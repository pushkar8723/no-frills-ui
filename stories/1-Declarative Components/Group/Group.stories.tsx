import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Button, IconButton } from '../../../src/components/Button';
import { Input, Select } from '../../../src/components/Input';
import { Group, GroupLabel } from '../../../src/components/Groups';
import SearchIcon from '../../resources/SearchIcon';

const meta: Meta<typeof Group> = {
  component: Group,
  title: 'Declarative Components/Group',
  tags: ['!dev', '!autodocs'],
};

export default meta;
type Story = StoryObj<typeof Group>;

export const MultipleComponents: Story = {
  render: () => (
    <Group>
      <GroupLabel><SearchIcon /></GroupLabel>
      <Input label='Search Campaign' />
      <Select label="Status" style={{ width: '100px' }}>
        <option>Active</option>
        <option>Inactive</option>
        <option>Disabled</option>
        <option>Deleted</option>
      </Select>
      <Button>Search</Button>
    </Group>
  ),
  parameters: {
    docs: {
      source: {
        code: `import { Group, GroupLabel } from 'no-frills-ui';

// Render
<Group>
    <Input required label='Discount' />
    <GroupLabel>%</GroupLabel>
</Group>`,
      },
    },
  },
};

export const GroupLabelStart: Story = {
  render: () => (
    <Group>
      <GroupLabel>$</GroupLabel>
      <Input type='number' label='Budget' />
    </Group>
  ),
};

export const GroupLabelEnd: Story = {
  render: () => (
    <Group>
      <Input required label='Discount' />
      <GroupLabel>%</GroupLabel>
    </Group>
  ),
};

export const WithErrorText: Story = {
  render: () => (
    <Group errorText='Invalid input'>
      <Input label='Discount' />
      <GroupLabel>%</GroupLabel>
    </Group>
  ),
};

export const Primary: Story = {
  render: (args) => (
    <Group {...args}>
      <Input label='Input' />
      <GroupLabel>Label</GroupLabel>
    </Group>
  ),
  args: {
    errorText: '',
  },
};
