

(function(){
  var exec = require('child_process').exec
  var messages = {
    initialized:[
      'Jasmine has been installed with example specs.',
      '',
      'To run the server:',
      '',
      'jasmine run',
      '',
      'To run the automated CI task with WebDriver:',
      '',
      'jasmine runci'
    ].join('\n')
  }
  var commands = {
    init: function(info){
      var workingDir = info.cwd
      exec('cp -R '+__dirname + '/template/* ' + workingDir, function(err){
        console.log(messages.initialized)
      })
    }, 
    run: function(){
      var server = require('server')
      server.start(8124)
    },
    ci:function(){
      console.log('ci')
    }
  }
  var run = function(evt){
    commands[evt.command](evt)
  }

  exports.supports = function(command){
    return Object.keys(commands).indexOf(command) > -1
  }
  exports.run = run
})()

