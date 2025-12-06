import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { ChipInput } from '../../../src/components/ChipInput';

const meta: Meta<typeof ChipInput> = {
    component: ChipInput as never,
    title: 'Declarative Components/ChipInput',
    tags: ['!dev', '!autodocs'],
};

export default meta;
type Story = StoryObj<typeof ChipInput>;

export const Primary: Story = {
    args: {
        label: 'Enter your Skills',
    },
};

export const Variants: Story = {
    render: () => (
        <div>
            <ChipInput label="Enter your Skills" required />
        </div>
    ),
    parameters: {
        docs: {
            source: {
                code: `<ChipInput label="Enter your Skills" required />`,
            },
        },
    },
};
