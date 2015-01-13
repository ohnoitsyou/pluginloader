'use strict';

var pluginloader = require('../lib/pluginloader.js');
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
  'check discovery of plugins': function(test) {
    this.loader.discover();
    test.expect(1);
    test.equal(this.loader.pluginList.length, 1, "Did not discover plugin");
    test.done();
  }
}   

