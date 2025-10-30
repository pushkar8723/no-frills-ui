import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Dialog, AlertDialog, PromptDialog, ConfirmDialog } from '../../../src/components';
import DialogDemo from '../../resources/DialogDemo';

const meta: Meta<typeof Dialog> = {
  component: Dialog,
  title: 'Imperative Components/Dialog',
  tags: ['!dev', '!autodocs'],
};

export default meta;
type Story = StoryObj<typeof Dialog>;

export const Demo: Story = {
  render: () => <DialogDemo />,
  parameters: {
    docs: {
      source: {
        code: 'See documentation below for detailed examples',
      },
    },
  },
};

export const AlertDialogProps: Story = {
  // @ts-ignore - This is for Controls only
  render: (args) => <AlertDialog {...args} />,
};

export const ConfirmDialogProps: Story = {
  // @ts-ignore - This is for Controls only
  render: (args) => <ConfirmDialog {...args} />,
};

export const PromptDialogProps: Story = {
  // @ts-ignore - This is for Controls only
  render: (args) => <PromptDialog {...args} />,
};

export const DialogProps: Story = {
  render: (args) => <Dialog {...args} />,
};
