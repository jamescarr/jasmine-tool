require.paths.unshift(__dirname+'/../lib/');
var vows = require('vows');
var assert = require('assert');
var runner = require('TestRunner');
var app = new(require("events").EventEmitter);
var events = new(require("events").EventEmitter);


var io = {
  listen:function(){return app; }
};

(function(){
  vows.describe('Websocket based test runner socket.io events').addBatch({
    'events from socket':{
      'start' : 
        message({type:'start'}).passedTo('reportRunnerStarting'),
      'suite':
        message({type:'suite'}).passedTo('reportSuiteResults'),
      'spec':
        message({type:'spec'}).passedTo('reportSpecResults'),
      'finished':
        message({type:'finished'}).passedTo('reportRunnerResults')
      },
      'run with suite specified':{
        topic:function(){
          app.on('send', this.callback);
          testRunner.runTests('#resume');
          app.removeListener('send', this.callback);
        },
        'sends run action':function(err, result){
          assert.equal('run', result.action);
        },
        'sends suite name':function(err, result){
          assert.equal('#resume', result.suite);
        },
        'sends runall as false':function(err, result){
          assert.isFalse(result.runall);
        }
      }, 
      'run with no suite specified':{
        topic:function(){
          app.on('send', this.callback);
          testRunner.runTests();
          app.removeListener('send', this.callback);
        },
        'specify runnall as true':function(err, result){
          assert.isTrue(result.runall);
        },
        'does not include a suite': function(err, result){
          assert.isUndefined(result.suite)
        }
      }
  }).export(module);
  
  // wiring and test setup
  var testRunner = new runner.RemoteTestRunner(events),
    reporter = {};
  ['reportRunnerStarting', 'reportSuiteResults', 
   'reportSpecResults', 'reportRunnerResults'].forEach(function(method){
    reporter[method] = function(evt){
      reporter.callback({method:method, arg:evt});
    }
  });
  testRunner.start(app, io);
  testRunner.addReporter(reporter);
  app.emit('connection', app);
  // stub client
  app.send = function(msg){
    app.emit('send', null, JSON.parse(msg));
  }

  // helper to make things more concise
  function message(obj){
    return {
      passedTo:function(name){
        return {
          topic:function(){
            reporter.callback = this.callback;
            app.emit('message', JSON.stringify(obj));
          },
          'should invoke report runner starting':function(a, b){
            assert.equal(a.method, name)
          },
          'contains full event':function(a, b){
            assert.deepEqual(obj, a.arg);
          }
        }
      }
    }
  }
})();
