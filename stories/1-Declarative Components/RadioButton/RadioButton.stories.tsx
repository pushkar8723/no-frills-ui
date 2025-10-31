import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { RadioGroup, RadioButton } from '../../../src/components/Input';

const meta: Meta<typeof RadioButton> = {
  component: RadioButton,
  title: 'Declarative Components/RadioButton',
  tags: ['!dev', '!autodocs'],
};

export default meta;
type Story = StoryObj<typeof RadioButton>;

export const WithRadioGroup: Story = {
  render: () => (
    <RadioGroup>
      <RadioButton name='type' label='D'/>
      <RadioButton name='type' label='W'/>
      <RadioButton name='type' label='M' disabled />
      <RadioButton name='type' label='Y'/>
    </RadioGroup>
  ),
  parameters: {
    docs: {
      source: {
        code: `<RadioGroup>
      <RadioButton name='type' label='D'/>
      <RadioButton name='type' label='W'/>
      <RadioButton name='type' label='M' disabled />
      <RadioButton name='type' label='Y'/>
    </RadioGroup>`,
      },
    },
  },
};

export const WithoutRadioGroup: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px' }}>
      <RadioButton name='viewType' label='D'/>
      <RadioButton name='viewType' label='W'/>
      <RadioButton name='viewType' label='M' disabled />
      <RadioButton name='viewType' label='Y'/>
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `<RadioButton name='viewType' label='D'/>
      <RadioButton name='viewType' label='W'/>
      <RadioButton name='viewType' label='M' disabled />
      <RadioButton name='viewType' label='Y'/>`,
      },
    },
  },
};

export const Primary: Story = {
  args: {
    label: 'Option',
    name: 'radio-button-group',
  },
};
