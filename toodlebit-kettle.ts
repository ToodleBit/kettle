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

/**
 * Custom blocks
 */
//% color=#008C8C weight=10 icon="\uf0eb"
namespace Kettle {

	
}

	
	
	
/**
 * Functions to operate NeoPixel strips.
 */
//% weight=5 color=#2699BF icon="\uf110"
namespace neopixel {
    /**
     * A NeoPixel lights
     */
    export class Lights {
        buf: Buffer;
        pin: DigitalPin;
        // TODO: encode as bytes instead of 32bit
        brightness: number;
        start: number; // start offset in LED lights
        _length: number; // number of LEDs
        _mode: NeoPixelMode;
        _matrixWidth: number; // number of leds in a matrix - if any

        /**
         * Shows all LEDs to a given color (range 0-255 for r, g, b).
         * @param rgb RGB color of the LED
         */
        //% blockId="neopixel_set_strip_color" block="%lights|show color %rgb=neopixel_colors"
        //% lights.defl=lights
        //% weight=85 blockGap=8
        //% parts="neopixel"
        showColor(rgb: number) {
            rgb = rgb >> 0;
            this.setAllRGB(rgb);
            this.show();
        }



        /**
         * Send all the changes to the lights.
         */
        //% blockId="neopixel_show" block="%lights|show" blockGap=8
        //% lights.defl=lights
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
        //% blockId="neopixel_clear" block="%lights|clear"
        //% lights.defl=lights
        //% weight=76
        //% parts="neopixel"
        clear(): void {
            const stride = this._mode === NeoPixelMode.RGBW ? 4 : 3;
            this.buf.fill(0, this.start * stride, this._length * stride);
        }

 

        /**
         * Set the brightness of the lights. This flag only applies to future operation.
         * @param brightness a measure of LED brightness in 0-255. eg: 255
         */
        //% blockId="neopixel_set_brightness" block="%lights|set brightness %brightness" blockGap=8
        //% lights.defl=lights
        //% weight=59
        //% parts="neopixel"
        setBrightness(brightness: number): void {
            this.brightness = brightness & 0xff;
        }


        /**
         * Set the pin where the neopixel is connected, defaults to P0.
         */
        //% weight=10
        //% parts="neopixel"
        setPin(pin: DigitalPin): void {
            this.pin = pin;
            pins.digitalWritePin(this.pin, 0);
            // don't yield to avoid races on initialization
        }



        private setBufferRGB(offset: number, red: number, green: number, blue: number): void {
            if (this._mode === NeoPixelMode.RGB_RGB) {
                this.buf[offset + 0] = red;
                this.buf[offset + 1] = green;
            } else {
                this.buf[offset + 0] = green;
                this.buf[offset + 1] = red;
            }
            this.buf[offset + 2] = blue;
        }

        private setAllRGB(rgb: number) {
            let red = unpackR(rgb);
            let green = unpackG(rgb);
            let blue = unpackB(rgb);

            const br = this.brightness;
            if (br < 255) {
                red = (red * br) >> 8;
                green = (green * br) >> 8;
                blue = (blue * br) >> 8;
            }
            const end = this.start + this._length;
            const stride = this._mode === NeoPixelMode.RGBW ? 4 : 3;
            for (let i = this.start; i < end; ++i) {
                this.setBufferRGB(i * stride, red, green, blue)
            }
        }
        private setAllW(white: number) {
            if (this._mode !== NeoPixelMode.RGBW)
                return;

            let br = this.brightness;
            if (br < 255) {
                white = (white * br) >> 8;
            }
            let buf = this.buf;
            let end = this.start + this._length;
            for (let i = this.start; i < end; ++i) {
                let ledoffset = i * 4;
                buf[ledoffset + 3] = white;
            }
        }
        private setPixelRGB(pixeloffset: number, rgb: number): void {
            if (pixeloffset < 0
                || pixeloffset >= this._length)
                return;

            let stride = this._mode === NeoPixelMode.RGBW ? 4 : 3;
            pixeloffset = (pixeloffset + this.start) * stride;

            let red = unpackR(rgb);
            let green = unpackG(rgb);
            let blue = unpackB(rgb);

            let br = this.brightness;
            if (br < 255) {
                red = (red * br) >> 8;
                green = (green * br) >> 8;
                blue = (blue * br) >> 8;
            }
            this.setBufferRGB(pixeloffset, red, green, blue)
        }
        private setPixelW(pixeloffset: number, white: number): void {
            if (this._mode !== NeoPixelMode.RGBW)
                return;

            if (pixeloffset < 0
                || pixeloffset >= this._length)
                return;

            pixeloffset = (pixeloffset + this.start) * 4;

            let br = this.brightness;
            if (br < 255) {
                white = (white * br) >> 8;
            }
            let buf = this.buf;
            buf[pixeloffset + 3] = white;
        }
    }


    /**
     * Create a new NeoPixel driver for `numleds` LEDs.
     * @param pin the pin where the KettleLights is connected.
     */
    //% blockId="neopixel_create" block="pin %pin"
    //% weight=90 blockGap=8
    //% parts="KettleLights"
    //% trackArgs=0,2
    //% blockSetVariable=lights
    export function create(pin: DigitalPin): Lights {
        let lights = new Lights();
        let stride = NeoPixelMode.RGBW ? 4 : 3;
        lights.buf = pins.createBuffer(20 * stride);
        lights.start = 0;
        lights._length = 20;
        lights._mode = NeoPixelMode.RGB;
        lights._matrixWidth = 0;
        lights.setBrightness(128)
        lights.setPin(pin)
        return lights;
    }

    /**
     * Converts red, green, blue channels into a RGB color
     * @param red value of the red channel between 0 and 255. eg: 255
     * @param green value of the green channel between 0 and 255. eg: 255
     * @param blue value of the blue channel between 0 and 255. eg: 255
     */
    //% weight=1
    //% blockId="neopixel_rgb" block="red %red|green %green|blue %blue"
    export function rgb(red: number, green: number, blue: number): number {
        return packRGB(red, green, blue);
    }

    /**
     * Gets the RGB value of a known color
    */
    //% weight=2 blockGap=8
    //% blockId="neopixel_colors" block="%color"
    export function colors(color: NeoPixelColors): number {
        return color;
    }

    function packRGB(a: number, b: number, c: number): number {
        return ((a & 0xFF) << 16) | ((b & 0xFF) << 8) | (c & 0xFF);
    }
    function unpackR(rgb: number): number {
        let r = (rgb >> 16) & 0xFF;
        return r;
    }
    function unpackG(rgb: number): number {
        let g = (rgb >> 8) & 0xFF;
        return g;
    }
    function unpackB(rgb: number): number {
        let b = (rgb) & 0xFF;
        return b;
    }

    /**
     * Converts a hue saturation luminosity value into a RGB color
     * @param h hue from 0 to 360
     * @param s saturation from 0 to 99
     * @param l luminosity from 0 to 99
     */
    //% blockId=neopixelHSL block="hue %h|saturation %s|luminosity %l"
    function hsl(h: number, s: number, l: number): number {
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
