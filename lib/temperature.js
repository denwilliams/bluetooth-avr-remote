const tempSensor = require('mc-tempsensor');
const { EventEmitter } = require('events');
let interval;

exports.start = function (config, emitter) {
  tempSensor.init(config.id);

  interval = setInterval(() => {
    tempSensor.readAndParse((err, data) => {
      if (err) {
        // Handle error
      } else {
        console.log(data);
        emitter.emit('temperature', data[0].temperature.celcius);
        // console.log('Temperature is ' + data[0].temperature.celcius + ' C');
      }
    });
  }, 60000);
};

exports.stop = () => {
  clearInterval(interval);
};
