/**
 * Use this file to define custom functions and blocks.
 * Read more at https://makecode.microbit.org/blocks/custom
 */

enum MyOptions {
    //% block="on"
    On,
    //% block="off"
    Off
}

enum MyScreenOptions {
    //% block="yes"
    Yes,
    //% block="no"
    No
}
/**
 * Custom blocks
 */
//% color=#008C8C weight=10 icon="\uf0eb"
namespace ToodleLights {


    let setpin = DigitalPin.P0
    let screenoutput = 1

    /**
    * Choose red light on or off
    * @param pin describe parameter here, eg: AnalogPin.P0
    * @param myoption either on or off, eg: on, off
    */
    //% weight=10
    //% blockId=toodlebit_red block="red light %pin| %MyOptions"
    export function set_redlight(pin: AnalogPin, myoption: MyOptions): void {
        // Add code here

        switch (pin) {
            case AnalogPin.P0:
                setpin = DigitalPin.P0
                break
            case AnalogPin.P1:
                setpin = DigitalPin.P1
                break
            case AnalogPin.P2:
                setpin = DigitalPin.P2
                break
            default:
                setpin = DigitalPin.P0
        }

        if (myoption == 0) {

            pins.digitalWritePin(setpin, 1)
            if (screenoutput == 1) { led.plot(2, 0) }
        } else {
            pins.digitalWritePin(setpin, 0)
            if (screenoutput == 1) { led.unplot(2, 0) }
        }


    }

    /**
* Choose amber light on or off
* @param pin describe parameter here, eg: AnalogPin.P0
* @param cond either on or off, eg: on, off
*/
    //% weight=10
    //% blockId=toodlebit_amber block="amber light %pin| %cond"
    export function set_amberlight(pin: AnalogPin, myoption: MyOptions): void {
        // Add code here

        switch (pin) {
            case AnalogPin.P0:
                setpin = DigitalPin.P0
                break
            case AnalogPin.P1:
                setpin = DigitalPin.P1
                break
            case AnalogPin.P2:
                setpin = DigitalPin.P2
                break
            default:
                setpin = DigitalPin.P0
        }

        if (myoption == 0) {

            pins.digitalWritePin(setpin, 1)
            if (screenoutput == 1) { led.plot(2, 2) }

        } else {
            pins.digitalWritePin(setpin, 0)
            if (screenoutput == 1) { led.unplot(2, 2) }
        }


    }

    /**
    * Choose green light on or off
    * @param pin describe parameter here, eg: AnalogPin.P0
    * @param cond either on or off, eg: on, off
    */
    //% weight=10
    //% blockId=toodlebit_green		block="green light %pin| %cond"
    export function set_greenlight(pin: AnalogPin, myoption: MyOptions): void {
        // Add code here

        switch (pin) {
            case AnalogPin.P0:
                setpin = DigitalPin.P0
                break
            case AnalogPin.P1:
                setpin = DigitalPin.P1
                break
            case AnalogPin.P2:
                setpin = DigitalPin.P2
                break
            default:
                setpin = DigitalPin.P0
        }

        if (myoption == 0) {

            pins.digitalWritePin(setpin, 1)
            if (screenoutput == 1) { led.plot(2, 4) }

        } else {
            pins.digitalWritePin(setpin, 0)
            if (screenoutput == 1) { led.unplot(2, 4) }
        }


    }

    /**
* Show traffic light output on MicroBit screen
* @param cond either yes or no, eg: yes, no
*/
    //% weight=9
    //% blockId=toodlebit_screen	block="Show on Microbit screen %cond"
    export function set_screenoptions(myscreen: MyScreenOptions): void {
        // Add code here
        if (myscreen == 1) { screenoutput = 0 } else { screenoutput = 1 }
    }
} 
