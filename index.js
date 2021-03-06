const readline = require('readline');
const MemoryStream = require('memorystream');
const BluetoothSerialPort = require('bluetooth-serial-port').BluetoothSerialPort;

const btSerial = new BluetoothSerialPort();
const memStream = new MemoryStream();
const config = require('./config.json');
const factor = 4;
let diff = 0;

const avrType = config.avr.type;
const remoteHost = config.remote.host;
const remoteChannel = config.remote.channel || 1;

const rl = readline.createInterface({
  input: memStream,
  // output: process.stdout
});

let avr = null;
let connectRetry = null;

// begin

switch (avrType) {
  case 'yamaha':
    avr = require('./avr/yamaha').create(config.avr.host);
    break;
  case 'pioneer':
    avr = require('./avr/pioneer').create(config.avr.host);
    break;
  default:
    throw new Error(`Unknown AVR type: ${avrType}`);
}

rl.on('line', l => {
  switch (l) {
    case 'INIT':
      return;
    case 'BTN_DN':
      avr.togglePower();
      return;
    case 'BTN_UP':
      return;
    default:
      if (l.indexOf('ADJ ') === 0) {
        diff += parseInt(l.substring(4));
        const adj = ~~(diff/4);
        diff = diff%4;
        if (adj !== 0) avr.adjustVolume(adj);
      }
      break;
  }
});

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
