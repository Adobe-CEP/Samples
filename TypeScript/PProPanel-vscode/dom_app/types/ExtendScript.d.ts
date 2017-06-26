// Type definitions for ExtendScript Built-in types
// Definitions by: Eric Robinson <eric@sonicbloom.io>

/**
 * The $ object provides a number of debugging facilities and informational methods.
 */
declare const $: Helper;

declare class Helper
{
    /**
     * The ExtendScript build information.
     */
    readonly build: string;
    /**
     * The ExtendScript build date.
     */
    readonly buildDate: Date;
    /**
     * The character used as the decimal point character in formatted numeric output.
     */
    decimalPoint: string;
    /**
     * The name of the current ExtendScript engine, if set.
     */
    readonly engineName: string;
    /**
     * The most recent run-time error information.
     * Assigning error text to this property generates a run-time error; however, the preferred way to generate a run-time error is to throw an {Error} object.
     */
    error: Error;
    /**
     * The file name of the current script.
     */
    readonly fileName: string;
    /**
     * Gets or sets low-level debug output flags.
     * A logical AND of bit flag values:
     *  - 0x0002 (2): Displays each line with its line number as it is executed.
     *  - 0x0040 (64): Enables excessive garbage collection. Usually, garbage collection starts when the number of objects has increased by a certain amount since the last garbage collection. This flag causes ExtendScript to garbage collect after almost every statement. This impairs performance severely, but is useful when you suspect that an object gets released too soon.
     *  - 0x0080 (128): Displays all calls with their arguments and the return value.
     *  - 0x0100 (256): Enables extended error handling (@see strict). 
     *  - 0x0200 (512): Enables the localization feature of the toString method. Equivalent to the localize property.
     */
    flags: number;
    /**
     * A reference to the global object, which contains the JavaScript global namespace.
     */
    readonly global: Object;
    /**
     * A high-resolution timer, measuring the time in microseconds. The timer starts when ExtendScript is initialized during the application startup sequence. Every read access resets the timer to Zero.
     */
    readonly hiresTimer: number;
    /**
     * The path for include files for the current script.
     */
    readonly includePath: string;
    /**
     * The current debugging level, which enables or disables the JavaScript debugger.
     * One of:
     *  - 0 (no debugging),
     *  - 1 (break on runtime errors),
     *  - or 2 (full debug mode).
     */
    level: number;
    /**
     * The current line number of the currently executing script.
     */
    readonly line: number;
    /**
     * Gets or sets the current locale.
     * The string contains five characters in the form LL_RR, where LL is an ISO 639 language specifier, and RR is an ISO 3166 region specifier. 
     * Initially, this is the value that the application or the platform returns for the current user. You can set it to temporarily change the locale for testing. To return to the application or platform setting, set to undefined, null, or the empty string.
     */
    locale: string;
    /**
     * Set to true to enable the extended localization features of the built-in toString() method.
     */
    localize: boolean;
    /**
     * The ExtendScript memory cache size, in bytes.
     */
    memCache: number;
    /**
     * The current operating system version information.
     * @example
     * // Result: Windows XP 5.1 Service Pack 2 
     * $.os 
     */
    readonly os: string;
    /**
     * An {ScreenObject} array containing information about the display screens attached to your computer.
     */
    readonly screens: Array<ScreenObject>;
    /**
     * The current stack trace.
     */
    readonly stack: string;
    /**
     * Sets or clears strict mode for object modification.
     * When true, any attempt to write to a read-only property causes a runtime error. Some objects do not permit the creation of new properties when true.
     */
    strict: boolean;
    /**
     * The version number of the ExtendScript engine.
     * Formatted as a three-part number and description; for example: "3.92.95 (debug)".
     */
    readonly version: string;

    /**
     * Shows an About box for the ExtendScript component, and returns
     * the text for the box.
     */
    about(): string;
    /**
     * Breaks execution at the current position.
     * @param {any} [condition] - A string containing a JavaScript statement to be used as a condition. If the statement evaluates to true or nonzero when this point is reached, execution stops.
     */
    bp(condition?: any): void;
    /**
     * Invokes the platform-specific color selection dialog, and returns the selected color.
     * @param {number} color - The color to be preselected in the dialog, as 0xRRGGBB, or -1 for the platform default.
     */
    colorPicker(color: number): number;
    /**
     * Loads and evaluates a file.
     * @param {File} file - The file to load.
     * @param {number} [timeout] - An optional timeout in milliseconds.
     */
    evalFile(file: File, timeout?: number): any;
    /**
     * Initiates garbage collection in the ExtendScript engine.
     */
    gc(): void;
    /**
     * Retrieves the value of an environment variable.
     * @param {string} name - The name of the variable.
     */
    getEnv(name: string): string;
    /**
     * Sets the value of an environment variable.
     * @param {string} name - The name of the variable.
     * @param {string} value - The value of the variable.
     */
    setEnv(name: string, value: string): void;
    /**
     * Suspends the calling thread for a number of milliseconds.
     * During a sleep period, checks at 100 millisecond intervals to see whether the sleep should be terminated. This can happen if there is a break request, or if the script timeout has expired.
     * @param {number} msecs - Number of milliseconds to sleep.
     */
    sleep(msecs: number): void;
    /**
     * Converts this object to a string.
     */
    toString():string;
    /**
     * Prints text to the Console.
     * @param {any} text - The text to print. All arguments are concatenated.
     */
    write(text: any): void;
    /**
     * Prints text to the Console, and adds a newline character.
     * @param {any} text - The text to print. All arguments are concatenated.
     */
    writeln(text: any): void;
}

declare class ScreenObject
{
    /**
     * Pixel position of the left side of the screen in global coordinates.
     */
    readonly left: number;
    /**
     * Pixel position of the top side of the screen in global coordinates.
     */
    readonly top: number;
    /**
     * Pixel position of the right side of the screen in global coordinates.
     */
    readonly right: number;
    /**
     * Pixel position of the bottom side of the screen in global coordinates.
     */
    readonly bottom: number;

    /**
     * True if the screen describes the primary display.
     */
    readonly primary: boolean;
}

declare class File
{
    // TODO: Fill this in.
}
