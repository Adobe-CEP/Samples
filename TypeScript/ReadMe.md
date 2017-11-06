# TypeScript in Adobe CEP and ExtendScript
This sample includes type declaration files (AKA Typings) for ExtendScript and certain Adobe Applications. It also includes samples that show how these typings may be used in a TypeScript enabled environment (e.g. Visual Studio Code).

[TypeScript](http://www.typescriptlang.org/) is a strongly-typed JavaScript superset that can be transpiled into JavaScript:

>TypeScript compiles to clean, simple JavaScript code which runs on any browser, in Node.js, or in any JavaScript engine that supports ECMAScript 3 (or newer).

Adobe CEP platforms implement all three of the above JavaScript engines - the CEP panel environment runs nw.js, a combination of io.js (a legacy node.js fork) and browser JavaScript (Chromium Embedded Framework), while ExtendScript is an ECMAScript 3 extension. This combination makes Adobe CEP extensions a perfect target for TypeScript's benefits.

## TypeScript for JavaScript/ExtendScript
One especially large benefit of TypeScript is that it can augment pure JavaScript development, enabling features like [IntelliSense](https://code.visualstudio.com/docs/languages/javascript) in many modern IDEs. You don't need to write TypeScript to take advantage of much of what the framework has to offer. For a deeper look at how TypeScript enables such features, take a look at [this document](https://github.com/Microsoft/TypeScript/wiki/JavaScript-Language-Service-in-Visual-Studio).

# TypeScript Declaration Files for ExtendScript
The TypeScript declaration files found here provide type extensions for the core ExtendScript APIs and per-application APIs. Including these in your project with the correct `tsconfig.js` setup will enable IntelliSense and static type checking in environments capable of taking advantage of TypeScript. For a working example, see the PProPanel example explained below.

## Developing the Declaration Files
Enhancements/additions to these declaration files should be focused on the versions of the files located in the `typings` directory, **_not_** those found within the `PProPanel-vscode` sample.

# PProPanel-vscode
**PProPanel-vscode** is a version of the [PProPanel sample](https://github.com/Adobe-CEP/Samples/tree/master/PProPanel) that has been converted to use the TypeScript declaration files. The only Visual Studio Code-specific adjustments can be found in the `.vscode` directory. Everything else is system-agnostic.

The PProPanel project has been adjusted in the following ways:

1) An NPM `package.json` file was added for users who wish to make use of NPM. As configured, it simply installs a recent version of TypeScript and type declarations for the version of Node.js supported in the Adobe CEP environment (io.js 1.2.0 which is roughly equivalent to Node.js 0.12.1).
1) A `.vscode` folder was added containing the following two files:
    1) `launch.json` - adjusts syntax highlighting for the `.debug` file and `.jsx` files.
    1) `settings.json` - provides the configuration necessary to get panel debugging working within Visual Studio Code.
1) HTML and ExtendScript content were split up into separate directories. HTML content is located in `dom_html` while ExtendScript content is located in `dom_app`. Each of these folders contains a unique `tsconfig.json` file. These files specify a TypeScript context wherein type resolution for any TypeScript/JavaScript/ExtendScript file in that directory (and any directory below it) will use the same type setup. This allows us to specify "no browser DOM APIs" for the ExtendScript environment and keeps the ExtendScript type declarations out of the browser context.
1) The `ExtendScript.d.ts` and `PremierePro.11.1.2.d.ts` files were added to the ExtendScript context. These type declaration files power the autocompletion/IntelliSense features for the ExtendScript context. **NOTE:** These files were **copied** from the `TypeScript/typings` directory. This should be a **_temporary solution_**.
1) The inline JavaScript content within `index.html` was moved into `pre-body.js` and `post-body.js`. Visual Studio Code (at least) [does not support JavaScript auto completion within HTML files](https://github.com/Microsoft/vscode/issues/15377#issuecomment-278578309). JavaScript content was therefore separated from the HTML to improve the development experience.
1) Minor adjustments to hard coded paths to support the changes in directory structure. As files were moved around, the hard-coded paths embedded within scripts were changed to compensate.
