var SerialPort = require('serialport');

module.exports = function (memStream, config) {
  var serial = new SerialPort(config.port, { baudRate: 9600 });

  // serial.on('open', function() {
  // });
  
  serial.on('error', function(err) {
    console.log('Error: ', err.message);
  });

  serial.on('data', function(buffer) {
    memStream.write(buffer);
  });
};
