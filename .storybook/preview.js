import React from 'react';
import ReactDOM from 'react-dom';

if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
    import('@axe-core/react').then((axe) => {
        axe.default(React, ReactDOM, 1000);
    });
}

/** @type { import('@storybook/react-webpack5').Preview } */
const preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        options: {
            storySort: {
                order: [
                    'Get Started',
                    [
                        'Introduction',
                        'Development',
                        'Theming',
                        'Extending Styles',
                        'Icons',
                        'Layer Manager',
                        'With Formik',
                    ],
                    'Declarative Components',
                    [
                        'Accordion',
                        'Badge',
                        'Button',
                        'Card',
                        'Checkbox',
                        'Chip',
                        'ChipInput',
                        'DragAndDrop',
                        'Drawer',
                        'Dropdown',
                        'Group',
                        'Input',
                        'Menu',
                        'Modal',
                        'Popover',
                        'Radio',
                        'RadioButton',
                        'Select',
                        'Spinner',
                        'Stepper',
                        'Tabs',
                        'TextArea',
                        'Toggle',
                        'Tooltip',
                    ],
                    'Imperative Components',
                    ['Dialog', 'Notification', 'Toast'],
                ],
            },
        },
        // Set the initial page to the Introduction doc
        viewMode: 'docs',
        previewTabs: {
            'storybook/docs/panel': { index: -1 },
        },
    },

    // Set initial story
    initialGlobals: {
        docsPage: 'get-started-introduction--docs',
    },

    tags: ['autodocs'],
};

export default preview;
