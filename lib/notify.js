var exec = require('child_process').exec;

var notifiers = {
  growlnotify: function(title, text){
    var growl = require('growl');
    libnotify.notify(text, {title:title});
  },
  'notify-send':function(title, text){
    var libnotify = require('libnotify');
    libnotify.notify(text, {title:title, time:500});
  },
  none:function(text){
    console.log(text);
  }
};

function notifyResults(title, text){
  exec('which growlnotify || which notify-send', 
    function(err, stdin, stderr){
      if(stdin == ''){
      }else{
        var parts = stdin.split('/'),
          command = parts[parts.length-1].trim();
        notifiers[command](title, text);
      }
  });
}

function NotifierReporter(){
  this.reportSpecResults = function(){};
  this.reportSuiteResults = function(){};
  this.reportRunnerStarting = function(){};
  this.reportRunnerResults = function(results){
    var results = results.results,
      state = results.failedCount > 0? 'FAIL' : 'PASS',
      text = [results.passedCount + ' passed',
              results.failedCount + ' failed',
              results.totalCount  + ' specs ran'].join('\n');
    
      notifyResults(state, text);
  };
}

exports.NotifierReporter = NotifierReporter;
