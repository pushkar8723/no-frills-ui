import type { Meta, StoryObj } from '@storybook/react-webpack5';
import MenuItemStory from '../../../src/components/Menu/MenuItemStory';

const meta: Meta<typeof MenuItemStory> = {
    component: MenuItemStory,
    title: 'Declarative Components/MenuItem',
    tags: ['!dev', '!autodocs'],
};

export default meta;
type Story = StoryObj<typeof MenuItemStory>;

export const MenuItemStoryProps: Story = {};
