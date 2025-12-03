import type { Meta, StoryObj } from '@storybook/react';
import { ConfirmDialog } from '../../../src/components';

const meta: Meta<typeof ConfirmDialog> = {
    component: ConfirmDialog,
    title: 'Imperative Components/Dialog/ConfirmDialog',
    tags: ['!dev', '!autodocs'],
};

export default meta;
type Story = StoryObj<typeof ConfirmDialog>;

// Props documentation story for ConfirmDialog
export const ConfirmDialogProps: Story = {
    // @ts-expect-error - This is for Controls only
    render: (args: object) => <ConfirmDialog {...args} />,
};
