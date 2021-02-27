

# ToodleBit Traffic Lights Package
This ToodleBit traffic lights package was developed by [ToodleBit](https://www.toodlebit.com/)

ToodleBit Traffic Lights has been designed for use in education, particularly the primary(KS2) sector. These code blocks have been created to provide an easier route for users to get their LEDs lit.


![ToodleBit Traffic Lights](https://github.com/ToodleBit/lights/blob/master/icon.png?raw=true)

## Code Example
```JavaScript
basic.forever(function () {
    if (run == true) {
        custom.set_redlight(AnalogPin.P0, MyOptions.On)
        basic.pause(1000)
        custom.set_amberlight(AnalogPin.P1, MyOptions.On)
        basic.pause(1000)
        custom.set_redlight(AnalogPin.P0, MyOptions.Off)
        custom.set_amberlight(AnalogPin.P1, MyOptions.Off)
        custom.set_greenlight(AnalogPin.P2, MyOptions.On)
        basic.pause(1000)
        custom.set_greenlight(AnalogPin.P2, MyOptions.Off)
    } else {
        custom.set_redlight(AnalogPin.P0, MyOptions.On)
        basic.pause(5000)
        run = true
    }
})
```

## License
MIT

## Supported targets
for PXT/microbit (The metadata above is needed for package search.)

