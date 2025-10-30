/** @type { import('@storybook/react').Preview } */
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
            'Get Started', ['Introduction', 'Development', 'Theming', 'Extending Styles', 'Icons', 'Layer Manager'], 
            'Declarative Components', ['Accordion', 'Badge', 'Spinner'], 
            'Imperative Components', ['Toast']
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
};

export default preview;
