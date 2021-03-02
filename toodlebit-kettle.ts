

let heatercondition = false
let watertemp = 50
let setpin = DigitalPin.P0

enum MyColours {
	//% block="Green"
	Green,
	//% block="Red"
	Red,
	//% block="Amber"
	Amber
}

enum MyOptions {
    //% block="on"
    On,
    //% block="off"
    Off
}

enum MyPinOptions {
    //% block="Pin0"
    Zero,
    //% block="Pin1"
    One,
    //% block="Pin2"
    Two
}

enum MyHeating {
    //% block="on"
    on,
    //% block="off"
    off
}


/**
 * Custom blocks
 */
//% color=#008C8C weight=10 icon="\uf0eb"
namespace Kettle {

/**
* This is a reporter block that returns a number
*/
//%  block="Water Temperature"
    export function WaterTemp(): number {
    return watertemp;
    }
	
/**
* Choose amber light on or off
* @param pin describe parameter here, eg: AnalogPin.P0
* @param myoption either on or off, eg: on, off
*/
    //% weight=10
    //% blockId=toodlebit_amber block="Turn %LColour light %myoption select %pin"
    export function set_light(LColour: MyColours, myoption: MyOptions, pin: MyPinOptions): void {
        // Add code here
        switch (pin) {
            case 0:
                setpin = DigitalPin.P0
                break
            case 1:
                setpin = DigitalPin.P1
                break
            case 2:
                setpin = DigitalPin.P2
                break
            default:
                setpin = DigitalPin.P0
                        }
		 if (myoption == 0) { pins.digitalWritePin(setpin, 1) } 
         else { pins.digitalWritePin(setpin, 0) }
		
		}

//% block="Turn heating element $myheating "
    export function heatingelement(myheating: MyHeating) {
        if (myheating == 0) {  heatercondition = true }
        else { heatercondition = false }
        RunHeater()
    }

function RunHeater(){
	while (heatercondition == true) {
		
    watertemp += 1
    
    if (watertemp == 51){
       led.plot(0, 4) 
       led.plot(1, 4) 
       led.plot(2, 4) 
       led.plot(3, 4) 
       led.plot(4, 4) 
    }  
    if (watertemp == 66){
        led.plot(0, 3) 
       led.plot(1, 3) 
       led.plot(2, 3) 
       led.plot(3, 3) 
       led.plot(4, 3) 
        }
        if (watertemp == 80){
        led.plot(0, 2) 
       led.plot(1, 2) 
       led.plot(2, 2) 
       led.plot(3, 2) 
       led.plot(4, 2) 
        }
      if (watertemp == 90){
        led.plot(0, 1) 
       led.plot(1, 1) 
       led.plot(2, 1) 
       led.plot(3, 1) 
       led.plot(4, 1) 
        }
          if (watertemp == 100){
        led.plot(0, 0) 
       led.plot(1, 0) 
       led.plot(2, 0) 
       led.plot(3, 0) 
       led.plot(4, 0) 
        }
        if (watertemp > 100){
        basic.clearScreen()
        basic.pause(200)
        basic.showIcon(IconNames.Chessboard)
        
          }
          basic.pause(200)
    }
    basic.clearScreen()
    watertemp = 0

		}
	
	

  
}
