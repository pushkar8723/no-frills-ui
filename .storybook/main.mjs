import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import remarkGfm from 'remark-gfm';

/** @type { import('@storybook/react-webpack5').StorybookConfig } */
const config = {
  stories: [
    '../stories/**/*.stories.tsx',
    '../stories/**/*.mdx',
  ],

  addons: [
    getAbsolutePath("@storybook/addon-webpack5-compiler-swc"),
    getAbsolutePath("@storybook/addon-links"),
    {
      name: getAbsolutePath("@storybook/addon-docs"),
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
    name: getAbsolutePath("@storybook/react-webpack5"),
    options: {}
  },

  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  }
};

export default config;

function getAbsolutePath(value) {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}
