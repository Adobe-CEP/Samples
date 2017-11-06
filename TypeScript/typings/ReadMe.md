# Notes About Declarations
Some of the declarations here may look strange at first glance. Explanations for [some of?] these are found below.

## ExtendScript's Object Uses Class Decomposition
You will note that the Object class us declared using [Class Decomposition](https://typescript.codeplex.com/wikipage?title=Writing%20Definition%20%28.d.ts%29%20Files) (which makes use of the [construct signature](https://www.typescriptlang.org/docs/handbook/interfaces.html#difference-between-the-static-and-instance-sides-of-classes)) and appears incomplete. This is intentional: the declarations will merge with the base ECMAScript `Object` and `ObjectConstructor` types from the core [es5 library](https://github.com/Microsoft/TypeScript/blob/master/src/lib/es5.d.ts). Where extra documentation existed for ExtendScript on pre-existing members (e.g. `ObjectConstructor.prototype`), the type declarations were included again. TypeScript _merges_ the additional documentation, resulting in augmented documentation.

## The $ object's "Helper" Interface
The `$` object is currently implemented as a `const` object with functions grafted onto it via the `Helper` interface. This was done because while the `$` object is identified as "[Helper Object]" in the ExtendScript Toolkit's Data Browser, there is no "Helper" class or type otherwise to be found.

## What is the PremiereObject Class?
There is no actual `PremiereObject` type in the Premiere Pro APIs. However, all Premiere Pro API object instances have additional class members that don't appear in the base ExtendScript `Object` class. This is a middleman type that allows auto-complete to resolve these members.
