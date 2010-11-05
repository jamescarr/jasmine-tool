var io = require ('socket.io'),
  events = require('events'),
  sys = require('sys')

var emit = new events.EventEmitter(),
    port = 8124

var STARTUP_MESSAGE = ['jasmine server started', 
      '', 
      'Navigate to http://localhost:'+port].join('\n');

function Server(app){
  var self = this
  this.start = function(){
    app.listen(port, function(){
      console.log(STARTUP_MESSAGE)
      self.emit('server-started')
    })
  }
  var socketConnect = function(){
    var socket = io.listen(app, {log:function(){}});
    socket.on('connection', function(client){
      client.on('message', function(msg){
        var evt = JSON.parse(msg)
        self.emit(evt.type, evt)
      });
    });
  }
  this.on('server-started', socketConnect)
};
sys.inherits(Server, events.EventEmitter)

var newServer = function(){
  var server = new Server(require(__dirname + '/ServerRoutes.js').routes)
  server.on('start', function(){
    console.log('Running specs...')
  })

  server.on('spec', function(spec){
    var results = spec.results
    console.log('  '+results.description)
    console.log('    Passed: ' + results.passedCount + ' Failed: ' + results.failedCount + ' Total: ' + results.totalCount)
  })
  server.on('finished', function(suite){
    console.log('specs finished')
  })
  return server
}

exports.newServer = newServer
// running as webworker
