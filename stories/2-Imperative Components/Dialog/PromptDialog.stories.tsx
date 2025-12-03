import type { Meta, StoryObj } from '@storybook/react';
import { PromptDialog } from '../../../src/components';

const meta: Meta<typeof PromptDialog> = {
    component: PromptDialog,
    title: 'Imperative Components/Dialog/PromptDialog',
    tags: ['!dev', '!autodocs'],
};

export default meta;
type Story = StoryObj<typeof PromptDialog>;

// Props documentation story for PromptDialog
export const PromptDialogProps: Story = {
    render: (args: object) => <PromptDialog {...args} />,
};
