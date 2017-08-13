const onOff = require('onoff');
const Gpio = require('onoff').Gpio;
const throttle = require('lodash.throttle');

const rotaryEncoder = require('./rotary');

exports.start = (config, emitter) => {
  const factor = config.factor;
  const encoder = rotaryEncoder(config.leftPin, config.rightPin);
  console.log('Listening for button', config.buttonPin);
  const button = new Gpio(config.buttonPin, 'in', 'falling');

  let encoderDelta = 0;
  let encoderFactored = 0;

  const throttledButton = throttle(() => {
    emitter.emit('button', true);
    console.log('Button press');
  }, 300, { leading: true, trailing: false });

  const throttledEmit = throttle(() => {
    emitter.emit('rotation', encoderFactored);
    encoderFactored = 0;
  }, 250, { leading: true, trailing: true });

  encoder.on('rotation', direction => {
    encoderDelta += direction;

    const adj = ~~(encoderDelta / factor);
    encoderDelta = encoderDelta % factor;
    if (adj !== 0) {
      encoderFactored += adj;
      throttledEmit();
    }

    if (direction > 0) {
      console.log('Encoder rotated right');
    } else {
      console.log('Encoder rotated left');
    }
  });

  button.watch((err, value) => {
    if (err) {
      console.error('Error', err);
    } else {
      throttledButton();
    }
  })
};
