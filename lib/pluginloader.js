/*
 * pluginloader
 * 
 *
 * Copyright (c) 2015 David Young
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs'),
    Q = require('q'),
    path = require('path'),
    util = require('util');

var PluginLoader = function(directory) {
  // resolve this to the root of the file system, then tack on the leading /
  this.basepath = path.join('/',path.relative('/',directory));
  this.version = "0.1.0";
  this.pluginList = [];
  this.attachedPlugins = [];
  this.loadedPlugins = [];
  this.initilizedPlugins = [];
  this.modules = [];
}

PluginLoader.prototype = {
  discover: function() {
    // for the colsure
    var that = this;
    return Q.when(that.getDirectories(that.basepath),function(directories) {
      return that.filterValidPlugins(directories).then(function(result) {
        that.pluginList = result;
        return result;
      });
    },function(error) {
      throw new Error('Discover error'+ error)
    });
  },
  load : function() {
    // Should actually call the folder as a require, this should force node
    //   to evaluate the module
    for(var i = 0; i < this.pluginList.length; i++) {
      var module;
      try {
        module = require(this.pluginList[i]);
      } catch (err) {
        console.log('error:',err);
        break;
      }
      this.modules.push(module);
      this.loadedPlugins.push(this.pluginList[i]);
    }
  },
  initilize : function() {
    // This will call the initilizer of the module so that it can setup
  },
  attach : function() {
    // Not sure what I want this to do yet, maybe it will expose it to the
    //   rest of the framework?
  },
  getDirectories : function(pluginDir) {
    return Q.when(this.isDirectory(pluginDir),function(isValid) {
      if(isValid) {
        return Q.nfcall(fs.readdir,pluginDir).then(function(dirs) {
          var filtered = dirs.map(function(dir) {
            return path.join(pluginDir, dir);
          });
          return Q.resolve(filtered);
        });
      } else {
        throw new Error("Not a directory");
      }
    },function(error) {
      throw new Error("Something?" + error);
    });
  },
  filterValidPlugins : function(dirs) {
    return Q.all(dirs.map(function(dir) {
      return Q.when(this.isValidPlugin(dir), function(isValid) {
        return isValid ? dir : '';
      })
    },this)).then(function(dirs) {
      return dirs.filter(function(dir) {
        return dir != '' ? true : false;
      },this);
    });
  },
  isValidPlugin : function(dir) {
    return Q.when(this.isDirectory(dir), function(isValid) {
      if(isValid) {
        var file = path.join(dir, 'package.json');
        return Q.nfcall(fs.open,file,'r').then(function(data){
          return Q.resolve(true);
        },function(error){
          return Q.resolve(false)
        });
      } else {
        throw new Error("Not a directory");
      }
    },function(error) {
      throw new Error("Directory open error");
    });
  },
  isDirectory: function(dir) {
    return  Q.nfcall(fs.stat,dir).then(
      function(stats) { return Q.resolve(stats.isDirectory()); },
      function(err) { return Q.reject(err);});
  }
}

module.exports = PluginLoader;

// vim: fdm=marker:expandtab:sw=2:softtabstop=2:nu:relativenumber
