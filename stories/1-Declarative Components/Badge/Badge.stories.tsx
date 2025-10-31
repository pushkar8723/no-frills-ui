import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Badge, BADGE_TYPE } from '../../../src/components/Badge';
import { Button } from '../../../src/components/Button';
 
const meta: Meta<typeof Badge> = {
  component: Badge,
  title: 'Declarative Components/Badge',
  tags: ['!dev', '!autodocs'],
};
 
export default meta;
type Story = StoryObj<typeof Badge>;
 
// Basic inline badge variants - all types shown together
export const AllTypes: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Badge inline type={BADGE_TYPE.PRIMARY}>Primary</Badge>
            <Badge inline type={BADGE_TYPE.SUCCESS}>Success</Badge>
            <Badge inline type={BADGE_TYPE.WARNING}>Warning</Badge>
            <Badge inline type={BADGE_TYPE.DANGER}>Danger</Badge>
            <Badge inline type={BADGE_TYPE.DISABLED}>Disabled</Badge>
        </div>
    ),
    parameters: {
        docs: {
            source: {
                code: `<Badge inline type={BADGE_TYPE.PRIMARY}>Primary</Badge>
<Badge inline type={BADGE_TYPE.SUCCESS}>Success</Badge>
<Badge inline type={BADGE_TYPE.WARNING}>Warning</Badge>
<Badge inline type={BADGE_TYPE.DANGER}>Danger</Badge>
<Badge inline type={BADGE_TYPE.DISABLED}>Disabled</Badge>`
            }
        }
    }
};

// Overlay badges on buttons
export const OverlayBadges: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '8px' }}>
            <Button>Filter <Badge>2</Badge></Button>
            <Button>Filter <Badge>99+</Badge></Button>
            <Button>Filter <Badge/></Button>
        </div>
    ),
    parameters: {
        docs: {
            source: {
                code: `<Button>Filter <Badge>2</Badge></Button>
<Button>Filter <Badge>99+</Badge></Button>
<Button>Filter <Badge/></Button>`
            }
        }
    }
};

// Inline badges on buttons
export const InlineBadges: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '8px' }}>
            <Button>Filter <Badge inline>2</Badge></Button>
            <Button>Filter <Badge inline>99+</Badge></Button>
            <Button>Filter <Badge inline/></Button>
        </div>
    ),
    parameters: {
        docs: {
            source: {
                code: `<Button>Filter <Badge inline>2</Badge></Button>
<Button>Filter <Badge inline>99+</Badge></Button>
<Button>Filter <Badge inline/></Button>`
            }
        }
    }
};

// Individual story for the primary badge (for Controls/props table)
export const Primary: Story = {
    args: {
        inline: true,
        type: BADGE_TYPE.PRIMARY,
        children: 'Primary'
    },
};