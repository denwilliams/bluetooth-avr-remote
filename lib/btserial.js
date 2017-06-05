const BluetoothSerialPort = require('bluetooth-serial-port').BluetoothSerialPort;

module.exports = function (memStream) {
  const btSerial = new BluetoothSerialPort();

  function onConnectSuccess() {
    console.log(`[bt] connected to remote: ${remoteHost}`);
    clearInterval(connectRetry);
  }

  function onConnectFail(err) {
    console.log('[bt] cannot connect', err);
  }

  btSerial.on('data', function(buffer) {
    memStream.write(buffer);
  });

  btSerial.on('closed', () => {
    startConnecting();
  })

  function connect() {
    btSerial.connect(remoteHost, remoteChannel, onConnectSuccess, onConnectFail);
  }

  function startConnecting() {
    connectRetry = setInterval(connect, 60000);
    connect();
  }

  startConnecting();
};
