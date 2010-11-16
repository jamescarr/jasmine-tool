(function(ctx, JSON){
  var io = require('socket.io'),
    events = require('events');

  function RemoteTestRunner(emitter){
    this.emitter = emitter || new events.EventEmitter();
  }
  RemoteTestRunner.prototype.addReporter = function(reporter){
    var emitter =this.emitter;
    emitter.on('start', reporter.reportRunnerStarting);
    emitter.on('suite', reporter.reportSuiteResults);
    emitter.on('spec', reporter.reportSpecResults);
    emitter.on('finished', reporter.reportRunnerResults);
  }
  RemoteTestRunner.prototype.start =function(app, providedIo) {
    var emitter = this.emitter;
    var socket = providedIo || io;
    socket.listen(app).on('connection', function(client){
      client.on('message', function(msg){
        console.log('got message:' + msg);
        var evt = JSON.parse(msg);
        emitter.emit(evt.type, evt);
      });
      emitter.on('reload', function(){
        client.send('reload');
      });
    });
  };
  RemoteTestRunner.prototype.runTests = function(suite){
    this.emitter.emit('run', suite);
  }
  // expose
  ctx.RemoteTestRunner = RemoteTestRunner;
    
})(exports, JSON)
