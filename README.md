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

Check it out with the [live demo]!

[live demo]: http://fidian.github.com/PrettyCSS/

More Reading
------------

* [Beautifier Options] - Everything you can configure with the pretty printer
* [Lint] - Here is a list of problems that could get detected
* [Errors and Warnings] - A listing of all error and warning codes that can be generated
* [Install] - instructions for how to get this running on your own computers
* [Command-Line Interface] - Once installed, here is how to run it
* [Function Reference] - The exposed functions on the object and the configuration options available for calling from JavaScript directly
* [Changelog] - See why we touched the code between releases

[Beautifier Options]: docs/BeautifierOptions.md
[Changelog]: docs/Changelog.md
[Command-Line Interface]: docs/CommandLine.md
[Errors and Warnings]: docs/ErrorsAndWarnings.md
[Function Reference]: docs/Functions.md
[Install]: docs/Install.md
[Lint]: docs/LintChecks.md
