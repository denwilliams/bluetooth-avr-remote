const VSX = require('./pioneer-avr').VSX;

const NOT_INITIALIZED = -1000;

exports.create = function createPioneerAvr(host) {
  const avr = new VSX({
    log: true,
    host: host,
    port: 23,
  });
  let volume = NOT_INITIALIZED;
  let power = NOT_INITIALIZED;

  avr.on('connect', () => {
    console.log('receiver connected');
    avr.query();
  });
  avr.on('power', isOn => {
    power = isOn;
  });
  avr.on('volume', db => {
    volume = db;
  });

  return {
    adjustVolume(amount) {
      // no adjustments until initialized
      if (volume === NOT_INITIALIZED) return;

      volume += amount;
      avr.volume(volume);
    },
    togglePower() {
      if (power) {
        avr.power(false);
      } else {
        avr.power(true);
      }
    }
  };
}
