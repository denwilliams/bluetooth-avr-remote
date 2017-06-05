var SerialPort = require('serialport');

module.exports = function (memStream) {
  var serial = new SerialPort("/dev/ttyUSB0", { baudRate: 9600 });

  // serial.on('open', function() {
  // });
  
  serial.on('error', function(err) {
    console.log('Error: ', err.message);
  });

  serial.on('data', function(buffer) {
    memStream.write(buffer);
  });
};
