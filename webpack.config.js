module.exports = {
  entry: './app.js',
  output: {
    filename: 'build/bundle.js'
  },
  watch: true,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: ['transform-runtime', 'babel-plugin-transform-decorators-legacy'],
            presets: ['es2015', 'stage-0'],
          }
        }
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          }
        ]
      }
    ]
  }
};