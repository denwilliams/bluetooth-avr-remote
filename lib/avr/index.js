let avr;

exports.start = (config, emitter) => {
  const avrType = config.type;
  const avrHost = config.host;

  switch (avrType) {
    case 'yamaha':
      avr = require('./yamaha').create(avrHost, emitter);
      break;
    case 'pioneer':
      avr = require('./pioneer').create(avrHost, emitter);
      break;
    default:
      throw new Error(`Unknown AVR type: ${avrType}`);
  }
};

exports.stop = (config, emitter) => {
  avr = null;
};

exports.togglePower = () => {
  if (!avr) return;
  return avr.togglePower();
};

exports.adjustVolume = (adj) => {
  if (!avr) return;
  avr.adjustVolume(adj);
};
