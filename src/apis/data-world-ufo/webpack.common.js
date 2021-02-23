const paths = require('./paths')

const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const isDev = process.env.NODE_ENV === 'development';

// const IMPLEMENTATION = 'OpenSky';
const IMPLEMENTATION = 'data-world-ufo-test';

module.exports = {
  entry: {
    main: [paths.src + '/index.js']
  },

  output: {
    path: paths.build,
    filename: '[name].bundle.js',
    publicPath: '/',
  },

  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      'vue$': isDev ? 'vue/dist/vue.runtime.js' : 'vue/dist/vue.runtime.min.js',
      '@': paths.src
    }
  },

  // Customize the webpack build process
  plugins: [
    new webpack.EnvironmentPlugin({
      implementation: IMPLEMENTATION
    }),
    new CleanWebpackPlugin(),

    new CopyWebpackPlugin({
      patterns: [
        {
          from: paths.public,
          to: 'assets',
          globOptions: {
            ignore: ['*.DS_Store'],
          },
        },
      ],
    }),

    // Generates deprecation warning: https://github.com/jantimon/html-webpack-plugin/issues/1501
    new HtmlWebpackPlugin({
      title: 'Vue Map',
      favicon: paths.src + '/images/favicon.png',
      template: paths.src + '/template.html',
      filename: 'index.html',
    }),

    new VueLoaderPlugin(),

    new webpack.EnvironmentPlugin(['NODE_ENV']),

    new MiniCSSExtractPlugin({
      filename: 'css/[name].[hash].css',
      chunkFilename: 'css/[id].[hash].css'
    }),

    new webpack.ids.HashedModuleIdsPlugin()
  ],

  // Determine how modules within the project are treated
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },

      {
        test: /\.vue$/,
        loader: 'vue-loader',
        include: paths.src
      },

      {
        test: /\.(scss|css)$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { sourceMap: true, importLoaders: 1 } },
          { loader: 'postcss-loader', options: { sourceMap: true } },
          { loader: 'sass-loader', options: { sourceMap: true } },
        ],
      },

      // {
      //   test: /\.css$/,
      //   use: [
      //     isDev ? 'vue-style-loader' : MiniCSSExtractPlugin.loader,
      //     { loader: 'css-loader', options: { sourceMap: isDev, importLoaders: 1 } },
      //   ]
      // },
      // {
      //   test: /\.scss$/,
      //   use: [
      //     isDev ? 'vue-style-loader' : MiniCSSExtractPlugin.loader,
      //     { loader: 'css-loader', options: { sourceMap: isDev } },
      //     { loader: 'sass-loader', options: { sourceMap: isDev } }
      //   ]
      // },
      // {
      //   test: /\.sass$/,
      //   use: [
      //     isDev ? 'vue-style-loader' : MiniCSSExtractPlugin.loader,
      //     { loader: 'css-loader', options: { sourceMap: isDev } },
      //     { loader: 'sass-loader', options: { sourceMap: isDev } }
      //   ]
      // },

      // Images: Copy image files to build folder
      { test: /\.(?:ico|gif|png|jpg|jpeg)$/i, type: 'asset/resource' },

      // Fonts and SVGs: Inline files
      { test: /\.(woff(2)?|eot|ttf|otf|svg|)$/, type: 'asset/inline' },
    ],
  },
}
