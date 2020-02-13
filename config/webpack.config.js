const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    index: './src/YandexMusicVoiceAssistant.js',
    getMicrophoneAccess: './src/getMicrophoneAccess.js'
  },
	output: {
		path: path.resolve(__dirname, '../dist'),
	},
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ["@babel/preset-env"],
            plugins: [
              "@babel/plugin-proposal-optional-chaining",
              "@babel/plugin-proposal-object-rest-spread",
              ["@babel/plugin-transform-runtime",
                {
                  "regenerator": true
                }
              ]
            ]
          }
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src/options.html'),
      inject: 'body',
      chunks: ['options'],
      filename: 'options.html'
    })
  ],
  devtool: 'inline-source-map',
};
