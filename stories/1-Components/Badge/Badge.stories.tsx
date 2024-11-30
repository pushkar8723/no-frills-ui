import type { Meta, StoryObj } from '@storybook/react';
 
import { Badge, BADGE_TYPE } from '../../../src/components/Badge';
 
const meta: Meta<typeof Badge> = {
  component: Badge,
};
 
export default meta;
type Story = StoryObj<typeof Badge>;
 
export const Primary: Story = {
    args: {
        inline: true,
        type: BADGE_TYPE.PRIMARY,
        children: 'Primary'
    },
};

export const Success: Story = {
    args: {
        inline: true,
        type: BADGE_TYPE.SUCCESS,
        children: 'Success'
    },
};