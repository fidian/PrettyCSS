Lint Checking
=============

PrettyCSS is more than just a CSS pretty printer.  Deep down, it tokenizes and parses your CSS file like how a browser would load it.  The structure of the CSS is checked for errors, the property names are checked and the values are validated to make sure they are potentially valid for that specific property.

Here is a list of the types of problems that are detected:

* Braces that do not match and missing semicolons, making the structure invalid.
* Misspellings on property names.
* Deprecated CSS that isn't applicable to today's browsers any longer.
* CSS that isn't forward compatible with the upcoming CSS3 spec.
* Suggestions to improve the quality of your CSS.
* Browser specific quirks and unofficial properties that are widely adopted.

Check out the [Errors and Warnings] page for more information.

The goal of the project is to create a single command-line tool that can read your CSS files and write it out reformatted when it's valid and ready for consumption.  The user should have the ability to specify any of the whitespace that gets modified anywhere in the file as well as determine what version of CSS that is being targeted.  To help prevent against mistakes, property names and values are checked.  In the end, this tool would be integrated with your development environments and your source code management system, so every commit to a CSS file would get standardized and checked before it entered your codebase.

[Errors and Warnings]: ErrorsAndWarnings.md
