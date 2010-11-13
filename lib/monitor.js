/**
 * shamelessly copied from https://github.com/remy/nodemon/
 */
var fs = require('fs'),
    sys = require('sys'),
    childProcess = require('child_process'),
    exec = childProcess.exec,
    flag = './.monitor',
    timeout = 1000; // check every 1 second


fs.writeFileSync(flag, '');

var startMonitor = function(server) {
  var cmd = 'find . -type f -newer ' + flag + ' -print';

  exec(cmd, function (error, stdout, stderr) {
    var files = stdout.split(/\n/);

    files.pop(); // remove blank line ending and split
    if (files.length) {
      fs.writeFileSync(flag, '');

      if (files.length) {
        files.forEach(function (file) {
          sys.log('[monitor] ' + file);
        });
        sys.print('\n\n');
		if (server && server.client) {
			sys.log('[monitor] sending reload command');
			server.client.send('reload');
		}
      }
    }
    setTimeout(function() { startMonitor(server); }, timeout);
  });
}

exports.startMonitor = startMonitor;
