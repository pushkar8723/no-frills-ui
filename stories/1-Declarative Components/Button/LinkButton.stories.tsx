import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { LinkButton } from '../../../src/components/Button';

const meta: Meta<typeof LinkButton> = {
    component: LinkButton as never,
    title: 'Declarative Components/LinkButton',
    tags: ['!dev', '!autodocs'],
};

export default meta;
type Story = StoryObj<typeof LinkButton>;

// Props documentation story
export const LinkButtonStory: Story = {
    render: () => <LinkButton>Link Button</LinkButton>,
};
