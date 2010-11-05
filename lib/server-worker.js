onmessage = function(evt){
  commands[evt.data.name]()
}

var commands = {
  start:function(){
    var s = require(__dirname + '/server')
    var server = s.newServer();
    server.on('finished', function(results){
      postMessage({name:'finished', results:results})
    })
    server.on('server-started', function(){
      postMessage({name:'started'})
    })
    server.start()
  }
}
