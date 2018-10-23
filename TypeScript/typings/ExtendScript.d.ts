// Type declarations for ExtendScript Built-in types
// Initial declarations by: Eric Robinson <eric@sonicbloom.io>

/**
 * The base class of all JavaScript objects.
 */
interface Object {
    /**
     * Points to the constructor function that created this object.
     * Note that this property is treated as an XML element in the XML class.
     */
    constructor: Function;

    /**
     * Retrieves and returns the Reflection object associated with this method or a property.
     * Note that this property is treated as an XML element in the XML class.
     */
    reflect: Reflection;

    /**
     * Creates and returns a string representation of this object.
     * This function serializes the object, so that it can, for example, be passed between engines. Pass the returned string back to eval() to recreate the object. Works only with built-in classes.
     */
    toSource(): string;

    /**
     * Many objects (such as Date) override this method in favor of their own implementation. If an object has no string value and no user-defined toString() method, the default method returns [object type], where "type" is the object type or the name of the constructor function that created the object.
     */
    toString(): string;

    /**
     * Removes the watch function of a property.
     * @param name The name of the property to unwatch.
     */
    unwatch(name: string): void;

    /**
     * If the object has no primitive value, returns the object itself.  Note that you rarely need to call this method yourself.  The JavaScript interpreter automatically invokes it when encountering an object where a primitive value is expected.
     */
    valueOf(): Object;

    /**
     * Adds a watch function to a property, which is called when the value changes.
     * This function can accept, modify, or reject a new value that the user, application, or a script has attempted to place in a property.
     * @param name The name of the property to watch.
     * @param func The function to be called when the value of this property changes.
     * This function must three arguments, and return as its result the value to be stored in the property. The arguments are:
     *      name: the name of the property that changes.
     *      oldValue: the old property value.
     *      newValue: the new property value that was specified.
     */
    watch(name: string, func: Function): void;
}

interface ObjectConstructor {
    /**
     * Note that this property is treated as an XML element in the XML class.
     */
    readonly prototype: Object;

    /**
     * Reports whether an object is still valid.
     * @param what The object to check.
     */
    isValid(what: Object): boolean;
}

/**
 * The $ object provides a number of debugging facilities and informational methods.
 */
declare const $: Helper;

interface Helper extends Object {
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
     * @param condition A string containing a JavaScript statement to be used as a condition. If the statement evaluates to true or nonzero when this point is reached, execution stops.
     */
    bp(condition?: any): void;
    /**
     * Invokes the platform-specific color selection dialog, and returns the selected color.
     * @param color The color to be preselected in the dialog, as 0xRRGGBB, or -1 for the platform default.
     */
    colorPicker(color: number): number;
    /**
     * Loads and evaluates a file.
     * @param file The file to load.
     * @param timeout An optional timeout in milliseconds.
     */
    evalFile(file: File, timeout?: number): any;
    /**
     * Initiates garbage collection in the ExtendScript engine.
     */
    gc(): void;
    /**
     * Retrieves the value of an environment variable.
     * @param name The name of the variable.
     */
    getEnv(name: string): string;
    /**
     * Sets the value of an environment variable.
     * @param name The name of the variable.
     * @param value The value of the variable.
     */
    setEnv(name: string, value: string): void;
    /**
     * Suspends the calling thread for a number of milliseconds.
     * During a sleep period, checks at 100 millisecond intervals to see whether the sleep should be terminated. This can happen if there is a break request, or if the script timeout has expired.
     * @param msecs Number of milliseconds to sleep.
     */
    sleep(msecs: number): void;
    /**
     * Converts this object to a string.
     */
    toString(): string;
    /**
     * Prints text to the Console.
     * @param text The text to print. All arguments are concatenated.
     */
    write(text: any): void;
    /**
     * Prints text to the Console, and adds a newline character.
     * @param text - The text to print. All arguments are concatenated.
     */
    writeln(text: any): void;
}

/**
 * Provides information about a class.
 */
declare class Reflection extends Object {
    /**
     * The long description text.
     */
    readonly description: string;

    /**
     * The short description text.
     */
    readonly help: string;

    /**
     * An array of method descriptions.
     */
    readonly methods: ReflectionInfo[];

    /**
     * The class name.
     */
    readonly name: string;

    /**
     * An array of property descriptions.
     */
    readonly properties: ReflectionInfo[];

    /**
     * Sample code, if present.
     */
    readonly sampleCode: string;

    /**
     * A file containing sample code. May be null.
     */
    readonly sampleFile: File;

    /**
     * An array of class method descriptions.
     */
    readonly staticMethods: ReflectionInfo[];

    /**
     * An array of class property descriptions.
     */
    readonly staticProperties: ReflectionInfo[];

    /**
     * Finds an element description by name.
     * @param name The name of the element to find.
     */
    find(name: string): ReflectionInfo;

    /**
     * Returns this class information as XML in OMV format.
     */
    toXML(): XML;
}

// Consider this for the ReflectionInfo.type parameter's type annotation:
// type ReflectionInfoTypeOption = "unknown" | "readonly" | "readwrite" | "createonly" | "method" | "parameter";

/**
 * Provides information about a method, a property or a method parameters.
 */
declare class ReflectionInfo extends Object {
    /**
     * The description of method or function arguments.
     */
    readonly arguments: ReflectionInfo[];

    /**
     * The data type.
     */
    readonly dataType: string;

    /**
     * The default value.
     */
    readonly defaultValue: any;

    /**
     * The long description text.
     */
    readonly description: string;

    /**
     * The short description text.
     */
    readonly help: string;

    /**
     * Contains true if the class describes a collection class.
     */
    readonly isCollection: boolean;

    /**
     * The maximum value.
     */
    readonly max: number;

    /**
     * The minimum value.
     */
    readonly min: number;

    /**
     * The element name.
     */
    readonly name: string;

    /**
     * The class object that this element belongs to.
     */
    readonly parent: Reflection;

    /**
     * Sample code, if present.
     */
    readonly sampleCode: string;

    /**
     * A file containing sample code. May be null.
     */
    readonly sampleFile: File;

    /**
     * The element type.
     * One of unknown, readonly, readwrite, createonly, method or parameter.
     */
    readonly type: string;
}

declare class ScreenObject extends Object {
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

/**
 * Represents a file in the local file system in a platform-independent manner.
 */
declare class File extends Object {
    // TODO: Fill this in.
}

/**
 * Wraps XML into an object.
 */
declare class XML extends Object {
    // TODO: Fill this in.
}
