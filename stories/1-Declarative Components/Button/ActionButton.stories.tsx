import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { ActionButton } from '../../../src/components/Button';

const meta: Meta<typeof ActionButton> = {
    component: ActionButton as never,
    title: 'Declarative Components/ActionButton',
    tags: ['!dev', '!autodocs'],
};

export default meta;
type Story = StoryObj<typeof ActionButton>;

// Props documentation story
export const ActionButtonStory: Story = {
    render: () => <ActionButton>Action Button</ActionButton>,
};
