import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { RaisedButton } from '../../../src/components/Button';

const meta: Meta<typeof RaisedButton> = {
    component: RaisedButton as never,
    title: 'Declarative Components/RaisedButton',
    tags: ['!dev', '!autodocs'],
};

export default meta;
type Story = StoryObj<typeof RaisedButton>;

// Props documentation story
export const RaisedButtonStory: Story = {
    render: () => <RaisedButton>Raised Button</RaisedButton>,
};
