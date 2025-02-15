// babel.config.cjs
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current', // ensure compatibility with your Node version
        },
      },
    ],
  ],
};
