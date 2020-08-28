module.exports = {
  stories: ["../src/**/*.stories.[tj]s[x]"],
  addons: [
    // "@storybook/addon-storysource",
    // "@storybook/addon-knobs",
    // "@storybook/addon-docs",
  ],
  webpackFinal: async (config) => {
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      use: [
        {
          loader: require.resolve("babel-loader"),
        },
        // Optional
        // {
        //   loader: require.resolve("react-docgen-typescript-loader"),
        // },
      ],
    });
    config.resolve.extensions.push(".ts", ".tsx");
    return config;
  },
};
