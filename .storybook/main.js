import { dirname, join } from "path";
const path = require('path');

module.exports = {
  stories: ['../stories/**/*.stories.hey.mdx', '../stories/**/*.stories.tsx'],

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
    getAbsolutePath("@storybook/addon-links"),
    getAbsolutePath("@storybook/addon-docs"),
    getAbsolutePath("@storybook/addon-mdx-gfm"),
    getAbsolutePath("@storybook/addon-webpack5-compiler-swc")
  ],

  framework: {
    name: getAbsolutePath("@storybook/react-webpack5"),
    options: {}
  }
};

function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, "package.json")));
}
