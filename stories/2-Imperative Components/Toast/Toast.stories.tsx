import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Toast, TOAST_TYPE } from '../../../src/components/Toast';
import { Button } from '../../../src/components/Button';
import ToastStory from '../../../src/components/Toast/ToastStory';

const meta: Meta = {
  title: 'Imperative Components/Toast',
  tags: ['!dev', '!autodocs'],
};

export default meta;
type Story = StoryObj;

// Variations story
export const Variations: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '8px', background: 'linear-gradient(to right, #00b09b, #96c93d)', padding: '20px', borderRadius: '8px' }}>
            <Button onClick={() => {
                Toast.add({
                    text: 'I am a 🍞 bro.',
                })
            }}>Simple Toast</Button>
            <Button onClick={() => {
                Toast.add({
                    text: 'I am a 🍞 bro.',
                    buttonText: 'Action',
                    buttonClick: () => alert('Action button on toast was clicked.')
                })
            }}>Action Toast</Button>
            <Button onClick={() => {
                Toast.add({
                    text: `
                        When a toast contains a very large string, the excess
                        string is wrapped and showed on the next line.
                    `
                })
            }}>Multiline Toast</Button>
            <Button onClick={() => {
                Toast.add({
                    text: `
                        When a toast contains a very large string, the excess
                        string is wrapped and showed on the next line.
                    `,
                    buttonText: 'Action',
                    buttonClick: () => alert('Action button on toast was clicked.'),
                })
            }}>Multiline Action Toast</Button>
        </div>
    ),
    parameters: {
        docs: {
            source: {
                code: `<Button onClick={() => {
    Toast.add({
        text: 'I am a 🍞 bro.',
    })
}}>Simple Toast</Button>

<Button onClick={() => {
    Toast.add({
        text: 'I am a 🍞 bro.',
        buttonText: 'Action',
        buttonClick: () => alert('Action button on toast was clicked.')
    })
}}>Action Toast</Button>

<Button onClick={() => {
    Toast.add({
        text: \`When a toast contains a very large string, the excess
            string is wrapped and showed on the next line.\`
    })
}}>Multiline Toast</Button>

<Button onClick={() => {
    Toast.add({
        text: \`When a toast contains a very large string, the excess
            string is wrapped and showed on the next line.\`,
        buttonText: 'Action',
        buttonClick: () => alert('Action button on toast was clicked.'),
    })
}}>Multiline Action Toast</Button>`
            }
        }
    }
};

// Types story
export const Types: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '8px', background: 'linear-gradient(to right, #00b09b, #96c93d)', padding: '20px', borderRadius: '8px' }}>
            <Button onClick={() => {
                Toast.add({
                    text: 'I am a 🍞 bro.',
                    type: TOAST_TYPE.INFO
                })
            }}>Information Toast</Button>
            <Button onClick={() => {
                Toast.add({
                    text: 'I am a 🍞 bro.',
                    type: TOAST_TYPE.SUCCESS
                })
            }}>Success Toast</Button>
            <Button onClick={() => {
                Toast.add({
                    text: 'I am a 🍞 bro.',
                    type: TOAST_TYPE.WARNING
                })
            }}>Warning Toast</Button>
            <Button onClick={() => {
                Toast.add({
                    text: 'I am a 🍞 bro.',
                    type: TOAST_TYPE.DANGER
                })
            }}>Danger Toast</Button>
        </div>
    ),
    parameters: {
        docs: {
            source: {
                code: `<Button onClick={() => {
    Toast.add({
        text: 'I am a 🍞 bro.',
        type: TOAST_TYPE.INFO
    })
}}>Information Toast</Button>

<Button onClick={() => {
    Toast.add({
        text: 'I am a 🍞 bro.',
        type: TOAST_TYPE.SUCCESS
    })
}}>Success Toast</Button>

<Button onClick={() => {
    Toast.add({
        text: 'I am a 🍞 bro.',
        type: TOAST_TYPE.WARNING
    })
}}>Warning Toast</Button>

<Button onClick={() => {
    Toast.add({
        text: 'I am a 🍞 bro.',
        type: TOAST_TYPE.DANGER
    })
}}>Danger Toast</Button>`
            }
        }
    }
};

// Documentation story for props table
export const Options: StoryObj<typeof ToastStory> = {
    render: () => <ToastStory text="I am a toast" />,
    args: {
        text: 'I am a toast',
        duration: 2000,
        type: TOAST_TYPE.NORMAL,
    },
};
