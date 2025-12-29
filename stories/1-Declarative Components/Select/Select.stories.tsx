import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Select } from '../../../src/components/Input';

const meta: Meta<typeof Select> = {
    component: Select,
    title: 'Declarative Components/Select',
    tags: ['!dev', '!autodocs'],
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Variants: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <Select label="Gender" required>
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="T">Transgender</option>
                <option value="N">Don&apos;t want to specify</option>
            </Select>
            <Select label="Country" value="IN" disabled>
                <option value="IN">India</option>
                <option value="US">America</option>
                <option value="UK">United Kingdom</option>
            </Select>
        </div>
    ),
    parameters: {
        docs: {
            source: {
                code: `<Select
        label='Gender'
        required
      >
        <option value="M">Male</option>
        <option value="F">Female</option>
        <option value="T">Transgender</option>
        <option value="N">Don't want to specify</option>
      </Select>
      <Select
        label='Country'
        value='IN'
        disabled
      >
        <option value="IN">India</option>
        <option value="US">America</option>
        <option value="UK">United Kingdom</option>
      </Select>`,
            },
        },
    },
};

export const Primary: Story = {};
