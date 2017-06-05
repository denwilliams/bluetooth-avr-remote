# avr-remote
Network connected AVR remote control via serial OR Blueooth connected Arduino rotary encoder

I use this at home to turn on and adjust the volume of the receiver from another room.
Only works with Yamaha at the moment, will be adding Pioneer soon.

Needs a `config.json` to work, eg:

Run the javascript on a raspberry pi or computer with node js.

It will connect to the remote over bluetooth at the specified address. The sketch for the remote is in the `/arduino` folder.

```
{
  "avr": {
    "type": "yamaha",
    "host": "192.168.0.123"
  },
  "remote": {
    "host": "98:D2:01:FF:25:C9"
  }
}
```
