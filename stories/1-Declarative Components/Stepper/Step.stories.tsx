import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Step } from '../../../src/components/Stepper';

const meta: Meta = {
    component: Step,
    title: 'Declarative Components/Step',
    tags: ['!dev', '!autodocs'],
};

export default meta;
type Story = StoryObj;

export const StepProps: Story = {
    // @ts-expect-error - This is for Controls only
    render: (args) => <Step {...args} />,
};
