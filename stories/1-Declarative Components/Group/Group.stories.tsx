import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Button } from '../../../src/components/Button';
import { Group, GroupLabel } from '../../../src/components/Groups';
import { Input, Select } from '../../../src/components/Input';
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
            <GroupLabel>
                <SearchIcon />
            </GroupLabel>
            <Input label="Search Campaign" />
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
                code: `<Group>
  <GroupLabel><SearchIcon /></GroupLabel>
  <Input label='Search Campaign' />
  <Select label="Status" style={{ width: '100px' }}>
    <option>Active</option>
    <option>Inactive</option>
    <option>Disabled</option>
    <option>Deleted</option>
  </Select>
  <Button>Search</Button>
</Group>`,
            },
        },
    },
};

export const GroupLabelStart: Story = {
    render: () => (
        <Group>
            <GroupLabel>$</GroupLabel>
            <Input type="number" label="Budget" />
        </Group>
    ),
    parameters: {
        docs: {
            source: {
                code: `Group>
  <GroupLabel>$</GroupLabel>
  <Input type='number' label='Budget' />
</Group>`,
            },
        },
    },
};

export const GroupLabelEnd: Story = {
    render: () => (
        <Group>
            <Input required label="Discount" />
            <GroupLabel>%</GroupLabel>
        </Group>
    ),
    parameters: {
        docs: {
            source: {
                code: `<Group>
  <Input required label='Discount' />
  <GroupLabel>%</GroupLabel>
</Group>`,
            },
        },
    },
};

export const WithErrorText: Story = {
    render: () => (
        <Group errorText="Invalid input">
            <Input label="Discount" />
            <GroupLabel>%</GroupLabel>
        </Group>
    ),
    parameters: {
        docs: {
            source: {
                code: `<Group errorText='Invalid input'>
  <Input label='Discount' />
  <GroupLabel>%</GroupLabel>
</Group>`,
            },
        },
    },
};

export const Primary: Story = {
    render: (args) => (
        <Group {...args}>
            <Input label="Input" />
            <GroupLabel>Label</GroupLabel>
        </Group>
    ),
    args: {
        errorText: '',
    },
};
