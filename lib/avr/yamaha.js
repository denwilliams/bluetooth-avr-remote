const Yamaha = require('yamaha-nodejs');
const NOT_INITIALIZED = -1000;

exports.create = function createYamahaAvr(host) {
  const yamaha = new Yamaha(host);
  let volume = NOT_INITIALIZED;

  yamaha.getBasicInfo(1)
  .catch(err => {
    console.error(`Could not connect to receiver: ${err.message}`)
  })
  .done(basicInfo => {
    if (!basicInfo) process.exit(1);

    console.log('getVolume', basicInfo.getVolume());
    // console.log('isMuted', basicInfo.isMuted());
    // console.log('isOn', basicInfo.isOn());
    // console.log('getCurrentInput', basicInfo.getCurrentInput());
    // console.log('isPartyModeEnabled', basicInfo.isPartyModeEnabled());
    volume = basicInfo.getVolume();
    basicInfo.isMuted();
    basicInfo.isOn();
    basicInfo.isOff();
    basicInfo.getCurrentInput();
    basicInfo.isPartyModeEnabled();
    basicInfo.isPureDirectEnabled();
  });

  return {
    adjustVolume(amount) {
      // no adjustments until initialized
      if (volume === NOT_INITIALIZED) return;

      // yamaha volume is represented as dB * 10 in increments of 5
      volume += 5 * amount;
      yamaha.setVolumeTo(volume, 1).then(() => {
        console.log('==', volume);
      });
      console.log('>>', volume);
    },
    togglePower() {
      yamaha.isOn(1).then(function (result) {
        // console.log("Receiver is: " + result);
        if (result) {
          yamaha.powerOff(1);
        } else {
          yamaha.powerOn(1);
        }
      })
    }
  };
}
