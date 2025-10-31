import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Dialog, AlertDialog, PromptDialog, ConfirmDialog, Card } from '../../../src/components';
import DialogDemo from '../../resources/DialogDemo';

const meta: Meta<typeof Dialog> = {
  component: Dialog,
  title: 'Imperative Components/Dialog',
  tags: ['!dev', '!autodocs'],
};

export default meta;
type DialogStory = StoryObj<typeof Dialog>;

export const Demo: DialogStory = {
  render: () => (
    <Card style={{
      display: 'flex', padding: '30px 20px',
      background: 'linear-gradient(to right, #00b09b, #96c93d)',
      overflow: 'visible'
    }}>
      <DialogDemo />,
    </Card>
  )
};

export const DialogProps = {
  component: Dialog,
  render: (args: any) => <Dialog {...args} />,
} satisfies Meta<typeof Dialog>;
