import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Card } from '../../../src/components/Card';
import { Dropdown } from '../../../src/components/Input';
import DropdownStory from '../../../src/components/Input/DropdownStory';
import { MenuItem } from '../../../src/components/Menu';

const meta: Meta<typeof DropdownStory> = {
    component: DropdownStory,
    title: 'Declarative Components/Dropdown',
    tags: ['!dev', '!autodocs'],
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

export const Variants: Story = {
    render: () => (
        <Card style={{ overflow: 'visible', padding: '16px' }}>
            <form style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <Dropdown label="Choose a fruit" required>
                    <MenuItem value="apple">Apple</MenuItem>
                    <MenuItem value="banana">Banana</MenuItem>
                    <MenuItem value="mango">Mango</MenuItem>
                    <MenuItem value="orange">Orange</MenuItem>
                </Dropdown>
                <Dropdown label="Choose a fruit" required multiSelect>
                    <MenuItem value="apple">Apple</MenuItem>
                    <MenuItem value="banana">Banana</MenuItem>
                    <MenuItem value="mango">Mango</MenuItem>
                    <MenuItem value="orange">Orange</MenuItem>
                </Dropdown>
                <Dropdown label="Choose a fruit" disabled>
                    <MenuItem value="apple">Apple</MenuItem>
                    <MenuItem value="banana">Banana</MenuItem>
                    <MenuItem value="mango">Mango</MenuItem>
                    <MenuItem value="orange">Orange</MenuItem>
                </Dropdown>
            </form>
        </Card>
    ),
    parameters: {
        docs: {
            source: {
                code: `import { Dropdown, MenuItem } from 'no-frills-ui';

//render
<Dropdown label='Choose a fruit' required multiSelect>
    <MenuItem value='apple'>Apple</MenuItem>
    <MenuItem value='banana'>Banana</MenuItem>
    <MenuItem value='mango'>Mango</MenuItem>
    <MenuItem value='orange'>Orange</MenuItem>
</Dropdown>`,
            },
        },
    },
};

export const Primary: Story = {};
