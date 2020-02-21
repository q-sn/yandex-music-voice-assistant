const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    background: './src/background.js',
    getMicrophoneAccess: './src/getMicrophoneAccess.js',
    YandexMusicVoiceAssistantManager: './src/YandexMusicVoiceAssistantManager.js',
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
      },
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        context: path.resolve(__dirname),
        from: path.resolve(__dirname, '../src/manifest.json'),
        to: path.resolve(__dirname, '../dist'),
      },
      {
        context: path.resolve(__dirname),
        from: path.resolve(__dirname, '../src/ym-get-microphone-access.html'),
        to: path.resolve(__dirname, '../dist'),
      },
    ]),
  ],
  devtool: 'inline-source-map',
};
