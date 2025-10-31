import React from "react";
import type { Meta, StoryObj } from '@storybook/react';
import { AlertDialog } from "../../../src/components";

const meta: Meta<typeof AlertDialog> = {
    component: AlertDialog,
    title: 'Imperative Components/Dialog/AlertDialog',
    tags: ['!dev', '!autodocs'],
};

export default meta;
type Story = StoryObj<typeof AlertDialog>;

// Props documentation story for AlertDialog
export const AlertDialogProps: Story = {
    render: (args: any) => <AlertDialog {...args} />,
};