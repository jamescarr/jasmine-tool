(function(ctx){
  var jasmine = ctx.jasmine

  jasmine.WebsocketReporter = function(){
    var self = this;
    this.isOpen = false;
    this.buffer = [];
    this.remotesock = io.connect('/jasmine-remote');

    this.remotesock.on('reload', function() {
  		window.location.reload();
    });
    
    this.remotesock.on('connected', function(){
      self.isOpen = true;
      while(self.buffer.length > 0){
        var el = self.buffer.shift();
        if(el.type != 'spec' && el.type != 'suite'){
          self.report(JSON.stringify(el));
        }
      }
    })
  }
  jasmine.WebsocketReporter.prototype.report = function(arg) {
    !this.isOpen?this.buffer.push(arg):this.remotesock.emit('result', arg);
  };
  jasmine.WebsocketReporter.prototype.reportRunnerStarting = function(runner){
    this.report({type:'start'})
  }
  var pad = function(parent){
     var spaces = ''
      while (parent != null){
        spaces += '  '
        parent = parent.parentSuite
      }
      return spaces
  }
  jasmine.WebsocketReporter.prototype.reportSuiteResults = function(suite){
     this.report({type:'suite', desc:suite.description, results:suite.results(), padding: pad(suite.parentSuite)});
  }
  jasmine.WebsocketReporter.prototype.reportSpecResults = function(spec){
    this.report({type:'spec', results: spec.results(), padding:"  " + pad(spec.suite)})
  }
  jasmine.WebsocketReporter.prototype.reportRunnerResults = function(runner){
    var results = runner.results();
     this.report({type:'finished', 
       results: {
        failedCount:results.failedCount,
        passedCount:results.passedCount,
        totalCount:results.totalCount,
        skipped: results.skipped
       }
    });
  }
})(window)
