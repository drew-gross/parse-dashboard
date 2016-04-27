/*
 * Copyright (c) 2016-present, Parse, LLC
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */
var configuration = require('./base.config.js');
var path = require('path');

configuration.entry = {dashboard: './dashboard/index.js'};
configuration.output.path = './Parse-Dashboard/public/bundles';

var webpack = require('webpack');

// Add propType removal to Babel
var loaders = configuration.module.loaders;
for (var i = 0; i < loaders.length; i++) {
  if (loaders[i].loader === 'babel-loader') {
    if (!loaders[i].query.presets) {
      loaders[i].query.presets = [];
    }
    loaders[i].query.presets.push(path.join(__dirname, '..', 'node_modules', 'react-component-explorer', 'babel-remove-proptypes'));
    loaders[i].query.presets.push(path.join(__dirname, '..', 'node_modules', 'react-component-explorer', 'babel-remove-explorer-demos'));
    break;
  }
}

// Enable minification
configuration.plugins.push(
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': '"production"'
    }
  }),
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    }
  }),
  new webpack.optimize.OccurenceOrderPlugin(),
  function() {
    this.plugin('done', function(stats) {
      if (stats.compilation.errors && stats.compilation.errors.length) {
        console.log(stats.compilation.errors);
        process.exit(1);
      }
    });
  }
);

module.exports = configuration;
