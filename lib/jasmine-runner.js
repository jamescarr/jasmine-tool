

(function(){
  var exec = require('child_process').exec
  var web = require('webworker')
  var Browser = require(__dirname+'/browser').Browser
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
      var server = require('server').newServer()
      server.start()
    },
    ci:function(){
      var worker = new web.Worker(__dirname + '/server-worker.js')
      var browser = {}

      worker.postMessage({name:'start'})
      worker.onmessage = function(e){
        if(e.data.name == 'finished'){
          worker.terminate()
          browser.stop()
        }else if (e.data.name == 'started'){
          browser = new Browser('google-chrome', 'http://localhost:8124')
          browser.start()
        }
      }
      worker.onerror = function(e){
        console.log("[ERROR]" + e.message)
        worker.terminate()
      }
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

