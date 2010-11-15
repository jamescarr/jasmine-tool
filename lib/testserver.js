(function(ctx){
  // dependencies
  var EventEmitter = require('events').EventEmitter, 
      emitter = new EventEmitter();

  // object defs
  function Server (app, config) {
    this.app = app;
    this.config = config.server;
  }
  Server.prototype.on = function(){
    emitter.on.apply(emitter, arguments);
  }
  Server.prototype.rerun = function(){
    emitter.emit('reload');
  }
  Server.prototype.start = function() {
    var routes = this.app,
        port = this.config.port;
    routes.listen(port, function(){
      emitter.emit('server-started', routes);
      console.log('Navigate to http://localhost:' +  port);
    })
  };
  
  // exposure
  ctx.TestServer = Server;
  ctx.init = function(e){
    emitter = e;
  }
})(exports)

