/** @type { import('@storybook/react-webpack5').StorybookConfig } */
module.exports = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    //"@storybook/addon-links",
    //"@storybook/addon-essentials",
    //"@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react",
    options: {},
  },
  docs: {
    //autodocs: "tag",
  },
};
