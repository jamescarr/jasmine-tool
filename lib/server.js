require.paths.unshift(__dirname);
var server = require('testserver')
  reporters = require('reporters'), 
  app = require('ServerRoutes').routes,
  runner = require('TestRunner'),
  emitter = new(require('events').EventEmitter),
  config = {server:{port:8124}};

function createServer(){
  server.init(emitter); // this stinks to high heaven
  var testServer = new server.TestServer(app, config),
    testRunner = new runner.RemoteTestRunner(emitter);
  
  testRunner.addReporter(new reporters.ConsoleReporter());
  testRunner.addReporter(new reporters.NotifierReporter());

  testServer.on('server-started', function(){
    testRunner.start(app);
  });
  return testServer;
}  
 
exports.newServer = createServer

