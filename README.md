PrettyCSS
=========

PrettyCSS is a CSS3-compliant parser, lint checker, and pretty printer.  With this tool you can check for CSS format violations and then beautify the code to standardize it.  With another configuration you are able to crunch your styles down as much as possible to produce minified output.

This was created because there were no tools at the time that really covered all of our use cases and that also handled CSS3.  Additionally, one can really benefit from the suggestions and value validation that is a part of PrettyCSS.

Features
--------

* Fast - over 500k of minified text can be loaded up, parsed, and checked against rules in a couple seconds
* Portable - it is written in JavaScript, so it runs on servers, workstations, and even directly in your web browser
* Thorough - CSS property names *and* values are checked to ensure you didn't mistype something
* Tested - Many tests are included to cover all sorts of scenarios, with more being written for every edge case found
* Free - the code is on [GitHub] (submit bugs and feature requests there) and use a MIT style [license]

[GitHub]: https://github.com/fidian/PrettyCSS
[license]: https://github.com/fidian/PrettyCSS/blob/master/docs/License.md

Live Demo
---------

Nothing says more than actually seeing a product in action, so below is a live demo of the PrettyCSS engine at work.  It updates live; as you type in CSS, the bottom text area updates with a pretty printed version.  It also reflects how a browser sees the CSS, so invalid markup is removed.  To understand this more, try typing in `a {garbage}` and you won't see "garbage" because the structure of the declaration is invalid.

Check out the errors and warnings tab to see exactly what's wrong and where the problem was located.  From there, you can ignore selective codes, just like using the [command-line interface].

<iframe title="PrettyCSS Live Demo" width="100%" height="400" scrolling="no" frameborder="0" id="1127290848" name="1127290848" allowtransparency="true" src="https://fidian.github.com/PrettyCSS/iframe.html"></iframe>

The above iframe uses the latest committed version from the [GitHub] repository automatically, so it might be broken one day or not the same as what you would get when you install PrettyCSS with npm.  When that happens, please file a bug.

More Reading
------------

* [Lint] - Here is a list of problems that could get detected
* [Errors and Warnings] - A listing of all error and warning codes that can be generated
* [Install] - instructions for how to get this running on your own computers
* [Command-Line Interface] - Once installed, he're is how to run it
* [Function Reference] - The exposed functions on the object and the configuration options available for calling from JavaScript directly
* [Changelog] - See why we touched the code between releases

[Changelog]: https://github.com/fidian/PrettyCSS/blob/master/docs/Changelog.md
[Command-Line Interface]: https://github.com/fidian/PrettyCSS/blob/master/docs/CommandLine.md
[Errors and Warnings]: https://github.com/fidian/PrettyCSS/blob/master/docs/ErrorsAndWarnings.md
[Function Reference]: https://github.com/fidian/PrettyCSS/blob/master/docs/Functions.md
[Install]: https://github.com/fidian/PrettyCSS/blob/master/docs/Install.md
[Lint]: https://github.com/fidian/PrettyCSS/blob/master/docs/Lint.md
