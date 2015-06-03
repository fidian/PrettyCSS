Functions Exposed By Object
===========================

The library is written in JavaScript and can be included either server side or in a web browser.

Including on Server Side
------------------------

Right now I have only been using [node.js] for developing the library, but there shouldn't be many things stopping you from using another interpreter.  First, you'll need to get it.  The package can be pulled from GitHub with `npm` by adding a line like this in your `package.json` file.

```
    "dependencies": {
        "PrettyCSS": "git+https://github.com/fidian/PrettyCSS.git"
    }
```

After this, a simple `npm install` will download it and let you use this one line to get the PrettyCSS object.

```
var PrettyCSS = require('PrettyCSS');
```

Including in a Web Browser
--------------------------

The code gets bundled up by [Browserify] into a single JavaScript source file.  You add it to a web page like you would with with any other JavaScript.  You may need to change the location of `bundle.js` to match where you install it on your system.

```
<script type="text/javascript" src="bundle.js"></script>
```

The second part is to get the PrettyCSS object.  The nice thing about Browserify is that it emulates the `require()` function, so it is the same identical code that runs in both the server-side version and the browser's version.  Thus, getting the PrettyCSS object looks almost the same.

```
var PrettyCSS = require('./prettycss');
```

This also includes [shim.js], which is a minimal shim to extend the Array prototype (bad form, I know) if needed to give it the `forEach()`, `some()`, `every()`, and `filter()` methods.  These are only added if the methods don't already exist, minimizing my evil impact.

PrettyCSS Methods
-----------------

The PrettyCSS object has only two methods exposed, which keeps things simple.

```
parse(css_string)
parse(css_string, options)
```

Takes a bunch of CSS and runs it through the tokenizer and parser in order to analyze the CSS.  Returns a Parser object.  The `options` object's properties are explained in [Beautifier Options].

```
parseFile(filename, callback)
parseFile(filename, callback, options)
```

Reads the contents of filename, runs those contents through the `parse()` method, and finally calls your callback.  Your callback's function signature should look like `function (err, parser)`.  `err` is an error exception that happened or `null` if there were no problems.  The `parser` parameter is a Parser object that the parse() method returned.  The `option` object's properties are detailed in [Beautifier Options].


[Beautifier Options]: BeautifierOptions.md
[Browserify]: https://github.com/substack/node-browserify
[node.js]: http://nodejs.org
[shim.js]: ../lib/shim.js
