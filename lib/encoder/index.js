const rotaryEncoder = require('./rotary');
const onOff = require('onoff');
const Gpio = require('onoff').Gpio

led = new Gpio(17, 'out'),
button = new Gpio(4, 'in', 'both');

exports.start = (config, emitter) => {
  const encoder = rotaryEncoder(config.leftPin, config.rightPin);
  console.log('Listening for button', config.buttonPin);
  const button = new Gpio(config.buttonPin, 'in', 'both');

  encoder.on('rotation', direction => {
    emitter.emit('rotation', direction);
    if (direction > 0) {
      console.log('Encoder rotated right');
    } else {
      console.log('Encoder rotated left');
    }
  });

  button.watch((err, value) => {
    if (err) {
      console.error('Error', err);
    }
    emitter.emit('button', true);
    console.log('Button press');
  })
};
