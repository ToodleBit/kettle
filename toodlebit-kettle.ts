/**
 * Well known colors for a NeoPixel strip
 */
enum NeoPixelColors {
    //% block=red
    Red = 0xFF0000,
    //% block=orange
    Orange = 0xFFA500,
    //% block=yellow
    Yellow = 0xFFFF00,
    //% block=green
    Green = 0x00FF00,
    //% block=blue
    Blue = 0x0000FF,
    //% block=indigo
    Indigo = 0x4b0082,
    //% block=violet
    Violet = 0x8a2be2,
    //% block=purple
    Purple = 0xFF00FF,
    //% block=white
    White = 0xFFFFFF,
    //% block=black
    Black = 0x000000
}

/**
 * Different modes for RGB or RGB+W NeoPixel strips
 */
enum NeoPixelMode {
    //% block="RGB (GRB format)"
    RGB = 1,
    //% block="RGB+W"
    RGBW = 2,
    //% block="RGB (RGB format)"
    RGB_RGB = 3
}

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
	
	
	/**
     * A NeoPixel strip
     */
    export class Strip {
        buf: Buffer;
        pin: DigitalPin;
        // TODO: encode as bytes instead of 32bit
        brightness: number;
        start: number; // start offset in LED strip
        _length: number; // number of LEDs
        _mode: NeoPixelMode;
        _matrixWidth: number; // number of leds in a matrix - if any

        /**
         * Shows all LEDs to a given color (range 0-255 for r, g, b).
         * @param rgb RGB color of the LED
         */
        //% blockId="neopixel_set_strip_color" block="%strip|show color %rgb=neopixel_colors"
        //% strip.defl=strip
        //% weight=85 blockGap=8
        //% parts="neopixel"
        showColor(rgb: number) {
            rgb = rgb >> 0;
            this.setAllRGB(rgb);
            this.show();
        }



        /**
         * Set LED to a given color (range 0-255 for r, g, b).
         * You need to call ``show`` to make the changes visible.
         * @param pixeloffset position of the NeoPixel in the strip
         * @param rgb RGB color of the LED
         */
        //% blockId="neopixel_set_pixel_color" block="%strip|set pixel color at %pixeloffset|to %rgb=neopixel_colors"
        //% strip.defl=strip
        //% blockGap=8
        //% weight=80
        //% parts="neopixel" advanced=true
        setPixelColor(pixeloffset: number, rgb: number): void {
            this.setPixelRGB(pixeloffset >> 0, rgb >> 0);
        }

        /**
         * Sets the number of pixels in a matrix shaped strip
         * @param width number of pixels in a row
         */
        //% blockId=neopixel_set_matrix_width block="%strip|set matrix width %width"
        //% strip.defl=strip
        //% blockGap=8
        //% weight=5
        //% parts="neopixel" advanced=true
        setMatrixWidth(width: number) {
            this._matrixWidth = Math.min(this._length, width >> 0);
        }



        /**
         * Send all the changes to the strip.
         */
        //% blockId="neopixel_show" block="%strip|show" blockGap=8
        //% strip.defl=strip
        //% weight=79
        //% parts="neopixel"
        show() {
            // only supported in beta
            // ws2812b.setBufferMode(this.pin, this._mode);
            ws2812b.sendBuffer(this.buf, this.pin);
        }

        /**
         * Turn off all LEDs.
         * You need to call ``show`` to make the changes visible.
         */
        //% blockId="neopixel_clear" block="%strip|clear"
        //% strip.defl=strip
        //% weight=76
        //% parts="neopixel"
        clear(): void {
            const stride = this._mode === NeoPixelMode.RGBW ? 4 : 3;
            this.buf.fill(0, this.start * stride, this._length * stride);
        }




    /**
     * Create a new NeoPixel driver for `numleds` LEDs.
     * @param pin the pin where the neopixel is connected.
     * @param numleds number of leds in the strip, eg: 24,30,60,64
     */
    //% blockId="neopixel_create" block="NeoPixel at pin %pin|with %numleds|leds as %mode"
    //% weight=90 blockGap=8
    //% parts="neopixel"
    //% trackArgs=0,2
    //% blockSetVariable=strip
    export function create(pin: DigitalPin, numleds: number, mode: NeoPixelMode): Strip {
        let strip = new Strip();
        let stride = mode === NeoPixelMode.RGBW ? 4 : 3;
        strip.buf = pins.createBuffer(numleds * stride);
        strip.start = 0;
        strip._length = numleds;
        strip._mode = mode || NeoPixelMode.RGB;
        strip._matrixWidth = 0;
        strip.setBrightness(128)
        strip.setPin(pin)
        return strip;
    }

   
    /**
     * Converts a hue saturation luminosity value into a RGB color
     * @param h hue from 0 to 360
     * @param s saturation from 0 to 99
     * @param l luminosity from 0 to 99
     */
    //% blockId=neopixelHSL block="hue %h|saturation %s|luminosity %l"
    export function hsl(h: number, s: number, l: number): number {
        h = Math.round(h);
        s = Math.round(s);
        l = Math.round(l);

        h = h % 360;
        s = Math.clamp(0, 99, s);
        l = Math.clamp(0, 99, l);
        let c = Math.idiv((((100 - Math.abs(2 * l - 100)) * s) << 8), 10000); //chroma, [0,255]
        let h1 = Math.idiv(h, 60);//[0,6]
        let h2 = Math.idiv((h - h1 * 60) * 256, 60);//[0,255]
        let temp = Math.abs((((h1 % 2) << 8) + h2) - 256);
        let x = (c * (256 - (temp))) >> 8;//[0,255], second largest component of this color
        let r$: number;
        let g$: number;
        let b$: number;
        if (h1 == 0) {
            r$ = c; g$ = x; b$ = 0;
        } else if (h1 == 1) {
            r$ = x; g$ = c; b$ = 0;
        } else if (h1 == 2) {
            r$ = 0; g$ = c; b$ = x;
        } else if (h1 == 3) {
            r$ = 0; g$ = x; b$ = c;
        } else if (h1 == 4) {
            r$ = x; g$ = 0; b$ = c;
        } else if (h1 == 5) {
            r$ = c; g$ = 0; b$ = x;
        }
        let m = Math.idiv((Math.idiv((l * 2 << 8), 100) - c), 2);
        let r = r$ + m;
        let g = g$ + m;
        let b = b$ + m;
        return packRGB(r, g, b);
    }

    export enum HueInterpolationDirection {
        Clockwise,
        CounterClockwise,
        Shortest
    }
  
}
