/*
 * pluginloader
 * 
 *
 * Copyright (c) 2015 David Young
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs'),
    q = require('q'),
    path = require('path');

var PluginLoader = function(directory) {
  // resolve this to the root of the file system, then tack on the leading /
  this.basepath = path.join('/',path.relative('/',directory));
  this.version = "0.1.0";
  this.pluginList = [];
  this.attachedPlugins = [];
  this.loadedPlugins = [];
  this.initilizedPlugins = [];

}

PluginLoader.prototype = {
  discover: function() {
    var something = getDirectories(this.basepath).then(filterValidPlugins).then(function(plugins) {return plugins}).done();
    console.log('something',something);
    //getDirectories(this.basepath).then(filterValidPlugins).then(console.log);
  }
}

function getDirectories(base) {
  var d = q.defer();
  fs.readdir(base, function(err, files) {
    files = files.map(function(file) {return path.join(base,file);})
    files = files.filter(function(file) {
      return q.fcall(function() {
        return fs.statSync(file);
      }).then(function(stats) {
        return stats.isDirectory();
      });
    });
    console.log('resolving');
    return d.resolve(files);
  });
  return d.promise;
}

function filterValidPlugins(dirs) {
  return q.all(dirs.map(function(dir) {
    return isValidPlugin(dir).then(function(dir) {
      return dir;
    }, function(err) {
      return '';
    });
  })).then(function(dirs) {
    return dirs.filter(function(d) { return d.length > 0 });
  });
}
function isValidPlugin(dir) {
  return q.fcall(function() {
    return fs.openSync(path.join(dir,'/package.json'),'r');
  }).then(function(data) {
    return dir;
  });
}

module.exports = PluginLoader;
