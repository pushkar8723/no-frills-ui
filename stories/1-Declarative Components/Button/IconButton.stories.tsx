import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { IconButton } from '../../../src/components/Button';

const meta: Meta<typeof IconButton> = {
    component: IconButton as never,
    title: 'Declarative Components/IconButton',
    tags: ['!dev', '!autodocs'],
};

export default meta;
type Story = StoryObj<typeof IconButton>;

// Props documentation story
export const IconButtonStory: Story = {
    render: () => <IconButton>Icon Button</IconButton>,
};
