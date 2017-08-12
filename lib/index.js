// const readline = require('readline');
// const MemoryStream = require('memorystream');


// const memStream = new MemoryStream();
const config = require('loke-config').create('avrremote');
const { EventEmitter } = require('events');
const e = new EventEmitter();

// BEGIN temperature
const temperature = require('./temperature');
temperature.start(config.get('temperature'), e);
// END temperature

// BEGIN rotary
const encoder = require('./encoder');
encoder.start(config.get('encoder'), e);
// END rotary

// BEGIN lcd
const lcd = require('./lcd');
lcd.start(config.get('lcd')).then(() => lcd.write('Starting', '...'));
// END lcd

// BEGIN avr
const avr = require('./avr');
avr.start(config.get('avr'), e);
// END avr

e.on('temperature', t => lcd.write('Temperature', t  + 'C'));
e.on('rotation', (direction, amount = 1) => {
  // avr volume bump
  lcd.write('Volume', 'UP');
  avr.adjustVolume(direction * amount);
});
e.on('button', () => {
  // avr power toggler
  lcd.write('Button', 'PRESS');
  avr.togglePower();
});

// const factor = 4;
// let diff = 0;

// const avrType = config.get('avr.type');
// const avrHost = config.get('avr.host');

// const rl = readline.createInterface({
//   input: memStream,
//   // output: process.stdout
// });

// require('./serial')(memStream, config.get('serial'));
// // require('./btserial')(memStream, config.get('bluetooth'));

// let avr = null;
// let connectRetry = null;

// // begin

// switch (avrType) {
//   case 'yamaha':
//     avr = require('./avr/yamaha').create(avrHost);
//     break;
//   case 'pioneer':
//     avr = require('./avr/pioneer').create(avrHost);
//     break;
//   default:
//     throw new Error(`Unknown AVR type: ${avrType}`);
// }

// rl.on('line', l => {
//   switch (l) {
//     case 'INIT':
//       return;
//     case 'BTN_DN':
//       avr.togglePower();
//       return;
//     case 'BTN_UP':
//       return;
//     default:
//       if (l.indexOf('ADJ ') === 0) {
//         diff += parseInt(l.substring(4));
//         const adj = ~~(diff/4);
//         diff = diff%4;
//         if (adj !== 0) avr.adjustVolume(adj);
//       }
//       break;
//   }
// });

