const LCD = require('./client');
let lcd;

module.exports = {
  write(line1, line2) {
    return lcd.home()
    .then(() => lcd.on())
    .then(() => lcd.print(line1 || ''))
    .then(() => lcd.setCursor(0, 1))
    .then(() => lcd.print(line2 || ''));
  },
  clear() {
    return lcd.clear();
  },
  off() {
    return lcd.off();
  },
  on() {
    return lcd.on();
  },
  start(config) {
    lcd = new LCD('/dev/i2c-1', 0x27);
    return lcd.init();
  }
};
