const BluetoothSerialPort = require('bluetooth-serial-port').BluetoothSerialPort;

module.exports = function (memStream, config) {
  const btSerial = new BluetoothSerialPort();

  const remoteHost = config.host;
  const remoteChannel = config.channel;

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
