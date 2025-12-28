import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Input } from '../../src/components';

const meta: Meta<typeof Input> = {
    component: Input,
    title: 'Get Started/With Formik',
    tags: ['!dev', '!autodocs'],
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Demo: Story = {
    render: () => <Input />,
};
