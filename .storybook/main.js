import remarkGfm from 'remark-gfm';

/** @type { import('@storybook/react-webpack5').StorybookConfig } */
const config = {
  stories: [
    '../stories/**/*.stories.tsx',
    '../stories/**/*.stories.new.mdx',
  ],

  addons: [
    "@storybook/addon-webpack5-compiler-babel",
    "@storybook/addon-links",
    {
      name: '@storybook/addon-docs',
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      },
    },
  ],

  framework: {
    name: "@storybook/react-webpack5",
    options: {}
  },

  docs: {
    autodocs: true
  },
  
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
};

export default config;
