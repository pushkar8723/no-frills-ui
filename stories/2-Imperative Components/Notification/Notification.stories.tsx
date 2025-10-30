import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Notification, NOTIFICATION_POSITION, NOTIFICATION_TYPE, Button } from '../../../src/components';
import { StoryProps } from '../../../src/components/Notification/Notification';

const meta: Meta<typeof StoryProps> = {
  component: StoryProps,
  title: 'Imperative Components/Notification',
  tags: ['!dev', '!autodocs'],
};

export default meta;
type Story = StoryObj<typeof StoryProps>;

export const Types: Story = {
  render: () => (
    <div style={{ background: 'linear-gradient(to right, #00b09b, #96c93d)', padding: '20px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <Button onClick={() => {
        Notification.add(NOTIFICATION_POSITION.TOP_RIGHT, {
          title: 'Information Notification',
          description: 'This notification contains some information.',
          type: NOTIFICATION_TYPE.INFO,
        })
      }}>Information</Button>
      <Button onClick={() => {
        Notification.add(NOTIFICATION_POSITION.TOP_RIGHT, {
          title: 'Success Notification',
          description: 'This notification contains success information.',
          type: NOTIFICATION_TYPE.SUCCESS,
        })
      }}>Success</Button>
      <Button onClick={() => {
        Notification.add(NOTIFICATION_POSITION.TOP_RIGHT, {
          title: 'Warning Notification',
          description: 'This notification contains warning information.',
          type: NOTIFICATION_TYPE.WARNING,
        })
      }}>Warning</Button>
      <Button onClick={() => {
        Notification.add(NOTIFICATION_POSITION.TOP_RIGHT, {
          title: 'Danger Notification',
          description: 'This notification contains error information.',
          type: NOTIFICATION_TYPE.DANGER,
        })
      }}>Danger</Button>
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `import { Notification, NOTIFICATION_POSITION, NOTIFICATION_TYPE } from 'no-frills-ui';

// Add a notification
// It returns an id which can be used to programmatically dismiss the notification.
const id = Notification.add(
    NOTIFICATION_POSITION.TOP_RIGHT, {
        title: 'New message received',
        description: 'Please share feedback if you like this approach.',
        type: NOTIFICATION_TYPE.INFO
    }
);

// Remove a notification
Notification.remove(NOTIFICATION_POSITION.TOP_RIGHT, id);

// Destroy stack of notification
Notification.destroy(NOTIFICATION_POSITION.TOP_RIGHT);`,
      },
    },
  },
};

export const Position: Story = {
  render: () => (
    <div style={{ background: 'linear-gradient(to right, #00b09b, #96c93d)', padding: '20px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <Button onClick={() => {
        Notification.add(NOTIFICATION_POSITION.TOP_LEFT, {
          title: 'Top Left Notification',
          description: 'I came from top left.'
        })
      }}>Top Left</Button>
      <Button onClick={() => {
        Notification.add(NOTIFICATION_POSITION.TOP_RIGHT, {
          title: 'Top Right Notification',
          description: 'I came from top right.'
        })
      }}>Top Right</Button>
      <Button onClick={() => {
        Notification.add(NOTIFICATION_POSITION.BOTTOM_RIGHT, {
          title: 'Bottom Right Notification',
          description: 'I came from bottom right.'
        })
      }}>Bottom Right</Button>
      <Button onClick={() => {
        Notification.add(NOTIFICATION_POSITION.BOTTOM_LEFT, {
          title: 'Bottom Left Notification',
          description: 'I came from bottom left.'
        })
      }}>Bottom Left</Button>
    </div>
  ),
};

export const Features: Story = {
  render: () => (
    <div style={{ background: 'linear-gradient(to right, #00b09b, #96c93d)', padding: '20px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <Button onClick={() => {
        Notification.add(NOTIFICATION_POSITION.TOP_RIGHT, {
          title: 'Sticky Notification',
          description: 'This notification will not go away until you dismiss it.',
          sticky: true,
        })
      }}>Sticky</Button>
      <Button onClick={() => {
        const id = Notification.add(NOTIFICATION_POSITION.TOP_RIGHT, {
          title: 'Button Notification',
          description: 'This notification will contains a actionable button.',
          sticky: true,
          buttonText: 'OK',
          buttonClick: () => { Notification.remove(NOTIFICATION_POSITION.TOP_RIGHT, id) }
        })
      }}>Actionable Notification</Button>
      <Button onClick={() => {
        Notification.add(NOTIFICATION_POSITION.TOP_RIGHT, {
          id: 'unique-id',
          title: 'Unique Notification',
          description: 'There will only be one of me.',
        })
      }}>Deduped Notification</Button>
      <Button onClick={() => {
        Notification.add(NOTIFICATION_POSITION.TOP_RIGHT, {
          title: 'Close me',
          description: 'This notification will trigger an alert on close.',
          onClose: () => alert('Notification closed'),
        })
      }}>Close Callback</Button>
    </div>
  ),
};

export const Options: Story = {
  // @ts-ignore - This is for Controls only
  render: (args) => <div {...args} />,
};
