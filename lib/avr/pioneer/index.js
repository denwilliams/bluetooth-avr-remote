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
    console.log('receiver connected... querying');
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
      if (volume === NOT_INITIALIZED) {
        console.log('NOT initialized');
        avr.query();
        return;
      }

      volume += amount;
      avr.volume(volume);
    },
    togglePower() {
      power = !power;
      avr.power(power);
    }
  };
}
