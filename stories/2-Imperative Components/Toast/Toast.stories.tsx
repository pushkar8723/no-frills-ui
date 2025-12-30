import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Button } from '../../../src/components/Button';
import { Toast, TOAST_TYPE } from '../../../src/components/Toast';
import ToastStory from '../../../src/components/Toast/ToastStory';
import { Ellipsis } from '../../../src/shared/styles';

const meta: Meta = {
    component: ToastStory,
    title: 'Imperative Components/Toast',
    tags: ['!dev', '!autodocs'],
};

export default meta;
type Story = StoryObj;

// Variations story
export const Variations: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '8px' }}>
            <Button
                onClick={() => {
                    Toast.add({
                        text: 'This is a simple toast.',
                    });
                }}
            >
                <Ellipsis>Simple Toast</Ellipsis>
            </Button>
            <Button
                onClick={() => {
                    Toast.add({
                        text: 'This is an action toast.',
                        buttonText: 'Action',
                        buttonClick: () => alert('Action button on toast was clicked.'),
                    });
                }}
            >
                <Ellipsis>Action Toast</Ellipsis>
            </Button>
            <Button
                onClick={() => {
                    Toast.add({
                        text: `
                        When a toast contains a very large string, the excess
                        string is wrapped and showed on the next line.
                    `,
                    });
                }}
            >
                <Ellipsis>Multiline Toast</Ellipsis>
            </Button>
            <Button
                onClick={() => {
                    Toast.add({
                        text: `
                        This is multiline toast with an action. When a toast contains a very large string, the excess
                        string is wrapped and showed on the next line.
                    `,
                        buttonText: 'Action',
                        buttonClick: () => alert('Action button on toast was clicked.'),
                    });
                }}
            >
                <Ellipsis>Multiline Action Toast</Ellipsis>
            </Button>
        </div>
    ),
    parameters: {
        docs: {
            source: {
                code: `<Button onClick={() => {
    Toast.add({
        text: 'This is a simple toast.',
    })
}}>Simple Toast</Button>

<Button onClick={() => {
    Toast.add({
        text: 'This is an action toast.',
        buttonText: 'Action',
        buttonClick: () => alert('Action button on toast was clicked.')
    })
}}>Action Toast</Button>

<Button onClick={() => {
    Toast.add({
        text: \`
            When a toast contains a very large string, the excess
            string is wrapped and showed on the next line.
        \`
    })
}}>Multiline Toast</Button>

<Button onClick={() => {
    Toast.add({
        text: \`
            This is multiline toast with an action. When a toast contains a very large string, the excess
            string is wrapped and showed on the next line.
        \`,
        buttonText: 'Action',
        buttonClick: () => alert('Action button on toast was clicked.'),
    })
}}>Multiline Action Toast</Button>`,
            },
        },
    },
};

// Types story
export const Types: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '8px' }}>
            <Button
                onClick={() => {
                    Toast.add({
                        text: 'This is an information toast.',
                        type: TOAST_TYPE.INFO,
                    });
                }}
            >
                <Ellipsis>Information Toast</Ellipsis>
            </Button>
            <Button
                onClick={() => {
                    Toast.add({
                        text: 'This is a success toast.',
                        type: TOAST_TYPE.SUCCESS,
                    });
                }}
            >
                <Ellipsis>Success Toast</Ellipsis>
            </Button>
            <Button
                onClick={() => {
                    Toast.add({
                        text: 'This is a warning toast.',
                        type: TOAST_TYPE.WARNING,
                    });
                }}
            >
                <Ellipsis>Warning Toast</Ellipsis>
            </Button>
            <Button
                onClick={() => {
                    Toast.add({
                        text: 'This is a danger toast.',
                        type: TOAST_TYPE.DANGER,
                    });
                }}
            >
                <Ellipsis>Danger Toast</Ellipsis>
            </Button>
        </div>
    ),
    parameters: {
        docs: {
            source: {
                code: `<Button onClick={() => {
    Toast.add({
        text: 'This is an information toast.',
        type: TOAST_TYPE.INFO
    })
}}>Information Toast</Button>

<Button onClick={() => {
    Toast.add({
        text: 'This is a success toast.',
        type: TOAST_TYPE.SUCCESS
    })
}}>Success Toast</Button>

<Button onClick={() => {
    Toast.add({
        text: 'This is a warning toast.',
        type: TOAST_TYPE.WARNING
    })
}}>Warning Toast</Button>

<Button onClick={() => {
    Toast.add({
        text: 'This is a danger toast.',
        type: TOAST_TYPE.DANGER
    })
}}>Danger Toast</Button>`,
            },
        },
    },
};

// Documentation story for props table
export const Options: StoryObj<typeof ToastStory> = {
    render: () => <ToastStory text="I am a toast" />,
};
