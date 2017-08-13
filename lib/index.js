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
lcd.start(config.get('lcd'))
.then(() => lcd.write('Starting', '...'));
// END lcd

// BEGIN avr
const avr = require('./avr');
avr.start(config.get('avr'), e);
// END avr

e.on('temperature', t => lcd.write('Temperature', t.toFixed(1)  + 'C'));
e.on('rotation', (change) => {
  avr.adjustVolume(change);
});
e.on('button', () => {
  avr.togglePower();
});
e.on('volume', (value) => {
  lcd.write('Volume', String(value));
});
e.on('power', (isOn) => {
  lcd.write('Power', isOn ? 'ON' : 'OFF');
});
