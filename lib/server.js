var express = require ('express')
var fs = require ('fs')
var app = express.createServer()

var rootDir = process.cwd()

app.configure(function(){
    app.set('views', __dirname + '/views');
})

app.get('/', function(req, res){
  readFromDir(rootDir, "/spec/", function(specs){
    readFromDir(rootDir, "/src/", function(src){
      res.render('index.jade', {
        locals:{
          srcs:src,
          specs:specs
        },
        layout:false
      })
    })
  })
});

function readFromDir(rootDir, dir, cb){
  fs.readdir(rootDir+dir, function(err, result){
    cb(result.filter(function(name){
      return name.match(/.js$/)
    }).map(function(item){
      return dir+item
    }))
  })
}
app.get('/run.js', function(req, res){
  var run = [
    "jasmine.getEnv().addReporter(new jasmine.TrivialReporter());",
    "jasmine.getEnv().execute();"
  ].join('\n');
  res.send(run, {'Content-Type':'application/javascript'});
});
app.get('/spec/*', function(req, res){
  getJavascriptFile(rootDir + '/spec/', req.params[0], res)
});
app.get('/src/*', function(req, res){
  getJavascriptFile(rootDir + '/src/', req.params[0], res)
});
app.get('/lib/*', function(req, res){
  var fileName = req.params[0]
  getJavascriptFile(__dirname + "/assets/", fileName, res)
});

function getJavascriptFile(path, filename, res){
  var file = path + filename
  fs.readFile(file, function(err, contents){
    res.send(contents, {'Content-Type':'application/javascript'})  
  })  
}

exports.start = function(port){
  app.listen(port, function(){
    console.log(
      ['jasmine server started', '', 'Navigate to http://localhost:'+port].join('\n')
    )
  })
}

exports.stop = function(){
}
