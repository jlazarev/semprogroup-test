const webpacConfig = {
  mode: 'production',
  entry: {
    main: './src/assets/js/main.js',
    vendor: './src/assets/js/vendor.js',
  },
  output: {
    filename: '[name].js',
  },
};

export default webpacConfig;
