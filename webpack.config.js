const ExtractTextPlugin = require("extract-text-webpack-plugin");

const extractSass = new ExtractTextPlugin("build/bundle.css");

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
        test: /\.scss$/,
        use: extractSass.extract({
          use: [{
            loader: "css-loader"
          }, {
            loader: "sass-loader"
          }],
          // use style-loader in development
          fallback: "style-loader"
        })
      },
      {
        test: /\.(png|jpg|gif|svg|otf)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: "./build/[name].[ext]",
              publicPath: "../",
            }
          }
        ]
      }
    ]
  },
  plugins: [
    extractSass
  ]
};