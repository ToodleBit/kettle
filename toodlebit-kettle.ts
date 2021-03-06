/**
 * Well known colors for a NeoPixel KettleLight
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

enum MyNeoPixelColors {
    //% block=red
    Red = 16711680,
    //% block=green
    Green = 65280,
    //% block=blue
    Blue = 255,
    //% block=purple
    Purple= 16711935,
    //% block=violet
    Violet = 9055202,
    //% block=indigo
    Indigo=4915330,
    //% block=yellow
    Yellow=16776960
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
 * Functions to operate NeoPixel strips.
 */
//% weight=5 color=#2699BF icon="\uf110" advanced=true
namespace neopixel {
    /**
     * A NeoPixel KettleLight
     */
    export class Light {
        buf: Buffer;
        pin: DigitalPin;
        // TODO: encode as bytes instead of 32bit
        brightness: number;
        start: number; // start offset in LED KettleLight
        _length: number; // number of LEDs
        _mode: NeoPixelMode;
        _matrixWidth: number; // number of leds in a matrix - if any


//% blockId="neopixel_set_strip_color_kettle" 
//% block="%KettleLight|show color %rgb"
//% KettleLight.defl=KettleLight
//% weight=85 blockGap=8
//% parts="neopixel"
showColor(rgb: MyNeoPixelColors) {
      rgb = rgb >> 0;
        this.setAllRGB(rgb);
        ws2812b.sendBuffer(this.buf, DigitalPin.P0);
    }

        /**
         * Turn off all LEDs.
         */
        //% blockId="neopixel_clear" block="%KettleLight|clear"
        //% KettleLight.defl=KettleLight
        //% weight=76
        //% parts="neopixel"
        clear(): void {
            const stride = this._mode === NeoPixelMode.RGBW ? 4 : 3;
            this.buf.fill(0, this.start * stride, this._length * stride);
			ws2812b.sendBuffer(this.buf, this.pin);
        }


        /**
         * Set the brightness of the KettleLight. This flag only applies to future operation.
         * @param brightness a measure of LED brightness in 0-255. eg: 255
         */
        //% blockId="neopixel_set_brightness" blockGap=8
        //% KettleLight.defl=KettleLight
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

       public setAllRGB(rgb: number) {
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

    }
    /**
     * Create a new NeoPixel driver for `numleds` LEDs.
     * @param pin the pin where the neopixel is connected.
     * @param numleds number of leds in the KettleLight, eg: 24,30,60,64
     */
    //% blockId="neopixel_create"  block="pin %pin"
    //% weight=90 blockGap=8
    //% parts="neopixel"
    //% trackArgs=0,2
    //% blockSetVariable=KettleLight
    export function create(pin: DigitalPin): Light {
        let KettleLight = new Light();
        let stride =  NeoPixelMode.RGBW ? 4 : 3;
        KettleLight.buf = pins.createBuffer(20 * stride);
        KettleLight.start = 0;
        KettleLight._length = 20;
        KettleLight._mode = NeoPixelMode.RGB;
        KettleLight._matrixWidth = 0;
        KettleLight.setBrightness(128)
        KettleLight.setPin(pin)
        return KettleLight;
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


}

enum MyOptions {
    //% block="on"
    On,
    //% block="off"
    Off
}
enum MyHeating {
    //% block="on"
    on,
    //% block="off"
    off
}

//% color=#5C2D91 weight=40 icon="\uf0f4"
namespace kettle {

    let buf: Buffer;
    let heatercondition = false
    let watertemp = 50

     //% blockId="neopixel_create" block
    //% weight=90 blockGap=8
    //% parts="neopixel"
    //% trackArgs=0,2
    //% blockSetVariable=kettle_lights
    export function connectLights(){
let KettleLight = neopixel.create(DigitalPin.P0)

    }   
        

    
//% blockId="neopixel_set_strip_color_kettle" 
//% block="%KettleLight|show color %rgb"
//% KettleLight.defl=KettleLight
//% weight=85 blockGap=8
//% parts="neopixel"
export function showColor(rgb: MyNeoPixelColors) {
      rgb = rgb >> 0;
        setAllRGB(rgb);
      ws2812b.sendBuffer(buf, DigitalPin.P0);
    }

 /**
     * Turn off all LEDs.
*/
//% blockId="neopixel_clear" block="%KettleLight|Turn off"
//% KettleLight.defl=KettleLight
//% weight=76
//% parts="neopixel"
export function clearlights(): void {
   // KettleLight.clear()
        }


function setBufferRGB(offset: number, red: number, green: number, blue: number): void {
            buf[offset + 0] = green;
            buf[offset + 1] = red;
            buf[offset + 2] = blue;
    }
		
function setAllRGB(rgb: number) {
            let red = unpackR(rgb);
            let green = unpackG(rgb);
            let blue = unpackB(rgb);

            const br = 128;
            if (br < 255) {
                red = (red * br) >> 8;
                green = (green * br) >> 8;
                blue = (blue * br) >> 8;
            }
            const stride = NeoPixelMode.RGBW ? 4 : 3;
            for (let i = 0; i < 24; ++i) {
                setBufferRGB(i * stride, red, green, blue)
    }
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

    //% block="Turn heating element $myheating "
    export function heatingelement(myheating: MyHeating) {
        if (myheating == 0) {  heatercondition = true; }
        else { heatercondition = false; }
        RunHeater();
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
    if (watertemp == 61){
        led.plot(0, 3) 
       led.plot(1, 3) 
       led.plot(2, 3) 
       led.plot(3, 3) 
       led.plot(4, 3) 
        }
        if (watertemp == 71){
        led.plot(0, 2) 
       led.plot(1, 2) 
       led.plot(2, 2) 
       led.plot(3, 2) 
       led.plot(4, 2) 
        }
      if (watertemp == 81){
        led.plot(0, 1) 
       led.plot(1, 1) 
       led.plot(2, 1) 
       led.plot(3, 1) 
       led.plot(4, 1) 
        }
          if (watertemp == 91){
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
    watertemp = 50

		}
     /**
* This is a reporter block that returns a number
*/
//%  block="Water Temperature"
    export function WaterTemp(): number {
    return watertemp;
    }   
}
