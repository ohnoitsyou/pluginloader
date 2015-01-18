'use strict';

var pluginloader = require('../lib/pluginloader.js');
var Q = require('q');
var path = require('path');

/*
{{{
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
}}}
*/
/*
{{{
exports['awesome'] = {
  setUp: function(done) {
    // setup here
    done();
  },
  'no args': function(test) {
    test.expect(1);
    // tests here
    test.equal(pluginloader.awesome(), 'awesome', 'should be awesome.');
    test.done();
  },
};
}}}
*/

exports['pluginloader'] = {
  setUp: function(done) {
    this.loader = new pluginloader('./plugins');
    done();
  },
  'version check': function(test) {
    test.expect(1);
    test.equal(this.loader.version,'0.1.0',"not the correct version");
    test.done();
  },
  'path check': function(test) {
    test.expect(1);
    test.equal(this.loader.basepath,path.join('/',path.relative('/','./plugins')),"Not the correct path");
    test.done();
  },
  'check initilized loader' : function(test) {
    test.expect(4);
    test.equal(this.loader.pluginList.length,0,"Plugin list not empty");
    test.equal(this.loader.attachedPlugins.length,0,"Attached plugins list not empty");
    test.equal(this.loader.loadedPlugins.length,0,"Loaded plugins list not empty");
    test.equal(this.loader.initilizedPlugins.length,0,"Initilized plugins list not empty");
    test.done();
  },
  'isDirectory directory success check' : function(test) {
    this.loader.isDirectory(__dirname).then(function(result) {
      test.expect(1);
      test.equal(result, true, "Not a directory")
      test.done();
    }).catch(function(err) {
      test.expect(1);
      test.ok(false, "errored out");
      test.done();
    });
  },
  'isDirectory file check' : function(test) {
    this.loader.isDirectory(__filename).then(function(result) {
      test.expect(1);
      test.equal(result, false, "Is a file");
      test.done();
    }).catch(function(err) {
      test.expect(1);
      test.ok(false, "errored out");
      test.done();
    });
  },
  'isValidPlugin valid check' : function(test) {
    var plugin = path.join(__dirname, '../plugins/foobar');
    this.loader.isValidPlugin(plugin).then(function(result) {
      test.expect(1);
      test.equal(result, true, "Not a valid plugin");
      test.done();
    }).catch(function(err) {
      test.expect(1);
      test.ok(false, "errored out");
      test.done();
    });
  },
  'isValidPlugin fail check' : function(test) {
    var plugin = path.join(__dirname, '../plugins/barbaz');
    this.loader.isValidPlugin(plugin).then(function(result) {
      test.expect(1);
      test.equal(result, false, "Not supposed to be a valid plugin");
      test.done();
    }).catch(function(err) {
      test.expect(1);
      test.ok(false, "errored out");
      test.done();
    });
  },
  'filterValidPlugins check' : function(test) {
    var plugins = [path.join(__dirname,'../plugins/foobar'),
                   path.join(__dirname,'../plugins/barbaz')];
    this.loader.filterValidPlugins(plugins).then(function(result) {
      // could test multiple things, and count the result + static tests
      test.expect(2);
      test.equal(result.length,1,"Not the right number of plugins");
      test.equal(result[0],plugins[0],"Didn't detect the valid plugin");
      test.done();
    });
  },
  'getDirectories valid check' : function(test) {
    var pluginDir = path.join(__dirname,'../plugins');
    var plugins = [path.join(__dirname,'../plugins/foobar'),
                   path.join(__dirname,'../plugins/barbaz')];
    this.loader.getDirectories(pluginDir).then(function(result) {
      test.expect(1);
      test.equal(result.length,2,"Wrong number of directories");
      test.done();
    },function(error) {
      test.expect(1);
      test.ok(false, "Failed out:" + error);
      test.done();
    });
  },
  'getDirectories invalid check' : function(test) {
    var pluginDir = __filename;
    this.loader.getDirectories(pluginDir).then(function(result) {
      test.expect(1);
      test.ok(false, "SHould have failed out");
      test.done();
    },function(error) {
      test.expect(1);
      test.ok(true,error);
      test.done();
    });
  },
  'discover check' : function(test) {
    // needed for the closure
    var that = this;
    this.loader.discover().then(function(result) {
      test.expect(4);
      test.equal(result.length, 1, "Incorrect number of plugins");
      test.equal(result[0],path.join(__dirname,"../plugins/foobar"),"Didnt detect the right plugin");
      test.equal(that.loader.pluginList.length,1,"Plugins not stored in pluginList");
      test.equal(that.loader.pluginList[0], path.join(__dirname,"../plugins/foobar"),"Plugin stored path not good");
      test.done();
    },function(error) {
      test.expect(1);
      test.ok(false, "Errored out" + error);
      test.done();
    }).catch(function(error) {
      console.log(error);
    });
  },
  'loader check' : function(test) {
    var that = this;
    that.loader.discover().then(function(result) {
      that.loader.load();
      test.expect(1);
      test.equal(that.loader.loadedPlugins.length, 1, "Didn't load plugin");
      test.done();
    }).catch(function(error) {
      test.expect(1);
      test.ok(false);
      test.done();
      console.log(error);
    });
  }
};










// vim: fdm=marker:sw=2:nu:relativenumber
