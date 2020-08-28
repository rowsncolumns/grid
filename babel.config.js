module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          chrome: ">70",
        },
        exclude: ["transform-regenerator"],
      },
    ],
    "@babel/preset-react",
    "@babel/preset-typescript",
  ],
  plugins: ["@babel/plugin-transform-modules-commonjs"],
};
