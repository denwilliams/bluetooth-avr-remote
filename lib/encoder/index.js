const wpi = require('wiring-pi');
const throttle = require('lodash.throttle');

wpi.wiringPiSetupSys();

const rotaryEncoder = require('./rotary');

exports.start = (config, emitter) => {
  const factor = config.factor;
  const encoder = rotaryEncoder(config.leftPin, config.rightPin);
  console.log('Listening for button', config.buttonPin);
  // const button = new Gpio(config.buttonPin, 'in', 'both');

  wpi.pinMode(config.buttonPin, wpi.INPUT);
  wpi.pullUpDnControl(config.buttonPin, wpi.PUD_UP);
  wpi.wiringPiISR(config.buttonPin, wpi.INT_EDGE_FALLING, function(delta) {
    console.log('Button changed to LOW (', delta, ')');
  });

  let encoderDelta = 0;
  let encoderFactored = 0;

  const throttledEmit = throttle(() => {
    emitter.emit('rotation', encoderFactored);
    encoderFactored = 0;
  }, 250, { leading: true, trailing: true });

  encoder.on('rotation', direction => {
    encoderDelta += direction;

    const adj = ~~(encoderDelta / factor);
    encoderDelta = encoderDelta % 4;
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

  // button.watch((err, value) => {
  //   if (err) {
  //     console.error('Error', err);
  //   }
  //   emitter.emit('button', true);
  //   console.log('Button press');
  // })
};
