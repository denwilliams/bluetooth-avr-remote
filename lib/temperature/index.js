const tempSensor = require('mc-tempsensor');
const { EventEmitter } = require('events');

let interval;

exports.start = function (config, emitter) {
  if (!config.id) throw new Error('No sensor ID');
  console.log('Checking temp sensor ' + config.id);
  tempSensor.init(config.id);

  interval = setInterval(() => {
    tempSensor.readAndParse((err, data) => {
      if (err) {
        // Handle error
      } else {
        console.log(data);
        emitter.emit('temperature', data[0].temperature.celcius);
        console.log('Temperature is ' + data[0].temperature.celcius + ' C');
      }
    });
  }, config.interval);
};

exports.stop = () => {
  clearInterval(interval);
};
