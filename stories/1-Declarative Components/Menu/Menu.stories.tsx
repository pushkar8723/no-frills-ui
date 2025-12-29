import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Menu, MenuItem } from '../../../src/components/Menu';
import MenuStory from '../../../src/components/Menu/MenuStory';

const meta: Meta<typeof MenuStory> = {
    component: MenuStory,
    title: 'Declarative Components/Menu',
    tags: ['!dev', '!autodocs'],
};

export default meta;
type Story = StoryObj<typeof MenuStory>;

export const MenuStoryProps: Story = {};

export const Variants: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <Menu
                style={{
                    maxWidth: '200px',
                    backgroundColor: 'white',
                    borderRadius: '10px',
                    overflow: 'hidden',
                }}
            >
                <MenuItem value="apple">Apple</MenuItem>
                <MenuItem value="orange">Orange</MenuItem>
                <MenuItem value="mango">Mango</MenuItem>
                <MenuItem value="Banana">Banana</MenuItem>
            </Menu>
            <Menu
                multiSelect
                style={{
                    maxWidth: '200px',
                    backgroundColor: 'white',
                    borderRadius: '10px',
                    overflow: 'hidden',
                }}
            >
                <MenuItem value="apple">Apple</MenuItem>
                <MenuItem value="orange">Orange</MenuItem>
                <MenuItem value="mango">Mango</MenuItem>
                <MenuItem value="Banana">Banana</MenuItem>
            </Menu>
        </div>
    ),
    parameters: {
        docs: {
            source: {
                code: `<Card>
        <Menu>
          <MenuItem value='apple'>Apple</MenuItem>
          <MenuItem value='orange'>Orange</MenuItem>
          <MenuItem value='mango'>Mango</MenuItem>
          <MenuItem value='Banana'>Banana</MenuItem>
        </Menu>
      </Card>
      <Card>
        <Menu multiSelect>
          <MenuItem value='apple'>Apple</MenuItem>
          <MenuItem value='orange'>Orange</MenuItem>
          <MenuItem value='mango'>Mango</MenuItem>
          <MenuItem value='Banana'>Banana</MenuItem>
        </Menu>
      </Card>`,
            },
        },
    },
};
