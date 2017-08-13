const Yamaha = require('yamaha-nodejs');
const NOT_INITIALIZED = -1000;

exports.create = function createYamahaAvr(host, emitter) {
  const yamaha = new Yamaha(host);
  let volume = NOT_INITIALIZED;
  let power = NOT_INITIALIZED;
  let muted = NOT_INITIALIZED;

  yamaha.getBasicInfo(1)
  .catch(err => {
    console.error(`Could not connect to receiver: ${err.message}`)
  })
  .done(basicInfo => {
    if (!basicInfo) process.exit(1);

    power = basicInfo.isOn();
    volume = basicInfo.getVolume();

    if (!basicInfo.isOn()) {
      setVolume(basicInfo.getVolume(), basicInfo.isMuted());

      basicInfo.getCurrentInput();
      basicInfo.isPartyModeEnabled();
      basicInfo.isPureDirectEnabled();
    } else {
      basicInfo.isOff();
    }
  });

  function setVolume(level, isMuted) {
    volume = level;
    emitter.emit('volume', (level / 10).toFixed(1));
  }

  function setPower(powerState) {
    power = powerState;
    emitter.emit('power', powerState);
  }

  return {
    adjustVolume(amount) {
      // no adjustments until initialized
      if (volume === NOT_INITIALIZED) return;

      // yamaha volume is represented as dB * 10 in increments of 5
      volume += 5 * amount;
      yamaha.setVolumeTo(volume, 1).then(() => {
        setVolume(level, muted);
      });
    },
    togglePower() {
      yamaha.isOn(1).then((result) => {
        if (result) {
          yamaha.powerOff(1);
        } else {
          yamaha.powerOn(1);
        }
        setPower(!result);
      })
    }
  };
}
