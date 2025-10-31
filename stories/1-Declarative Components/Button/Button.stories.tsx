import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Button, LinkButton, RaisedButton, ActionButton, IconButton } from '../../../src/components/Button';
import SearchIcon from '../../resources/SearchIcon';

const meta: Meta<typeof Button> = {
  component: Button,
  title: 'Declarative Components/Button',
  tags: ['!dev', '!autodocs'],
};

export default meta;
type Story = StoryObj;

export const EnabledState: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <Button><SearchIcon /> Button</Button>
            <LinkButton><SearchIcon /> Link Button</LinkButton>
            <RaisedButton><SearchIcon /> Raised Button</RaisedButton>
            <ActionButton><SearchIcon /> Action Button</ActionButton>
            <IconButton><SearchIcon /></IconButton>
        </div>
    ),
    parameters: {
        docs: {
            source: {
                code: `<Button><SearchIcon /> Button</Button>
<LinkButton><SearchIcon /> Link Button</LinkButton>
<RaisedButton><SearchIcon /> Raised Button</RaisedButton>
<ActionButton><SearchIcon /> Action Button</ActionButton>
<IconButton><SearchIcon /></IconButton>`
            }
        }
    }
};

export const DisabledState: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <Button disabled><SearchIcon /> Disabled Button</Button>
            <LinkButton disabled><SearchIcon /> Disabled Link Button</LinkButton>
            <RaisedButton disabled><SearchIcon /> Disabled Raised Button</RaisedButton>
            <ActionButton disabled><SearchIcon /> Disabled Action Button</ActionButton>
            <IconButton disabled><SearchIcon /></IconButton>
        </div>
    ),
    parameters: {
        docs: {
            source: {
                code: `<Button disabled><SearchIcon /> Disabled Button</Button>
<LinkButton disabled><SearchIcon /> Disabled Link Button</LinkButton>
<RaisedButton disabled><SearchIcon /> Disabled Raised Button</RaisedButton>
<ActionButton disabled><SearchIcon /> Disabled Action Button</ActionButton>
<IconButton disabled><SearchIcon /></IconButton>`
            }
        }
    }
};

// Props documentation story
export const Primary: Story = {
    render: () => <Button>Button</Button>,
    args: {
        children: 'Button',
    },
};
