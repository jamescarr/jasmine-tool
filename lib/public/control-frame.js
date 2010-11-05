(function(ctx){
  var jasmine = ctx.jasmine
  
  var ws = new io.Socket('localhost')

  jasmine.WebsocketReporter = function(){
    var self = this;
    this.isOpen = false;
    this.buffer = [];
    ws.on('connect', function(){
      self.isOpen = true;
      while(self.buffer.length > 0)
        self.report(JSON.stringify(self.buffer.shift()));
    })
    ws.connect()
  }
  jasmine.WebsocketReporter.prototype.report = function(arg) {
    !this.isOpen?this.buffer.push(arg):ws.send(arg)
  };
  jasmine.WebsocketReporter.prototype.reportRunnerStarting = function(runner){
    this.report({type:'start'})
  }
  jasmine.WebsocketReporter.prototype.reportSuiteResults = function(suite){
    if(suite.parentSuite != null){
      var r = suite.results()
      var results = {failedCount: r.failedCount, passedCount:r.passedCount, totalCount:r.totalCount, skipped:r.skipped}
      this.report({type:'suite', results: results, name:suite.description})
    }
  }
  jasmine.WebsocketReporter.prototype.reportSpecResults = function(suite){
    this.report({type:'spec', results: suite.results()})
  }
  jasmine.WebsocketReporter.prototype.reportRunnerResults = function(runner){
    this.report({type:'finished', results: runner.results()})
  }
})(window)
