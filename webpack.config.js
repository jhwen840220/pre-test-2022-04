const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const isProd = process.env.NODE_ENV === 'production';
const { npm_lifecycle_event } = process.env;

const config = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(ts|tsx)?$/,
        exclude: /node_modules/,
        use: ['ts-loader'],
      },
      {
        test: /\.s?css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              additionalData: '',
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        include: [path.join(__dirname, 'src/svg')],
        use: [
          {
            loader: 'svg-sprite-loader',
            options: {
              spriteFilename: () => `svg-sprite.svg${isProd ? '?v=[contenthash]' : ''}`,
            },
          },
        ],
      },
      {
        test: /svg\\.*-svgo\.svg$/,
        use: [
          {
            loader: 'svgo-loader',
            options: {
              configFile: path.join(__dirname, 'svgo.config.js'),
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './src/index.html',
    }),
    new webpack.ProvidePlugin({
      React: 'react',
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css',
      chunkFilename: 'css/[name].[contenthash].css',
    }),
    new SpriteLoaderPlugin(),
    new CleanWebpackPlugin(),
  ],
  resolve: {
    modules: [path.join(__dirname, 'node_modules')],
    alias: {
      '~src': path.join(__dirname, 'src'),
      '~components': path.join(__dirname, 'src/components'),
      '~svg': path.join(__dirname, 'src/svg'),
    },
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.scss', '.sass', '.css'],
  },
  optimization: {
    minimizer: [
      // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
      `...`,
      new CssMinimizerPlugin(),
    ],
  },
};

if (npm_lifecycle_event === 'build:analyzer') {
  config.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = config;
