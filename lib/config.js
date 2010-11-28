function Configuration(location){
  var self = this;
  self.load = function(cb){
    require.async('fs', function(err, fs){
      fs.readFile(location, function(err, config){
        if(err){
          console.error('No config file found at ' + file);
          cb(self);
        }else{
          var configuration  = JSON.parse(config);
          for (var k in configuration){
            self[k] = configuration[k];
          }
          cb(self);
        }
      });
    });
  }

  self.reload = self.load;
}

exports.Configuration = Configuration;
