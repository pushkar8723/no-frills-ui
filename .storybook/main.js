const path = require('path');

module.exports = {
  stories: ['../stories/**/*.stories.mdx'],
  presets: [
    {
      name: '@storybook/preset-typescript',
      options: {
        include: [
          path.resolve(__dirname, '../src'),
          path.resolve(__dirname, '../stories'),
        ],
      },
    },
  ],
  addons: [
      '@storybook/addon-actions', '@storybook/addon-links', '@storybook/addon-docs',
      '@storybook/addon-viewport/register',
    ],
};
