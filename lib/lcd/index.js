const Queue = require('promise-queue');
const LCD = require('./client');
let lcd;
let timeout;
const queue = new Queue(1, Infinity);

module.exports = {
  write(line1, line2) {
    return queue.add(() => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => lcd.off(), 5000);

      return lcd.clear()
      .then(() => lcd.on())
      .then(() => lcd.home())
      .then(() => lcd.print(line1 || ''))
      .then(() => lcd.setCursor(0, 1))
      .then(() => lcd.print(line2 || ''));
    });
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
