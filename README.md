Description
===========

PrettyCSS is a project to make a CSS3-compliant parser, lint checker, and
pretty printer.  With this tool we will be able to check for CSS format
violations and then will beautify the code to standardize it.  With another
configuration you are able to crunch your styles down as much as possible
to produce minified output and we can just ignore the warnings.

This was created because there were no tools that I could download and use
on my own computer that also handled CSS3.  Also, we could really benefit
from some hints and value validation that is now incorporated into PrettyCSS.

The PrettyCSS project is on [GitHub](https://github.com/fidian/prettycss/).
Further documentation is at http://fidian.com/prettycss and there's a little
bit more under the docs/ folder inside the repository.

Installation
============

First, you can use the pretty printer *in your browser* without any
additional setup.  Take a look at http://www.fidian.com/prettycss and use the
live demo.  The HTML and JavaScript can be copied out of the repository and
placed wherever you need them.

For a little more power, or if you like using the command line to reformat
your CSS files, this is not too hard to get set up on your system.  First,
you will need [node.js](http://nodejs.org/) set up on your system.  Then
you can use `sudo npm install PrettyCSS` and it should be ready to use
on your system as the `prettycss` command.  Further, more detailed
instructions are at http://www.fidian.com/prettycss/installation and they
give you alternate ways that the program can get installed.

Usage
=====

The easiest way is to use the web interface.  You can do this by either
opening www/test.html from the repository in your browser or by going to
http://www.fidian.com/prettycss/ and looking at the live demo.  Both methods
use the current, bleeding-edge code that was committed to the repository.
I suggest you go try it out and see what it can do!

You can also use the command line program.  If you installed PrettyCSS
using npm, then you can run the pretty printer quite easily.

    prettycss my_input_file.css

There's a few options that are explained on the website at
http://www.fidian.com/prettycss/command-line and those options control
how warnings and errors affect the pretty printing, and other ways to
configure the software.

Lastly, this can also be linked into your existing JavaScript code, such
as what you might be writing with [node.js](http://nodejs.org/).  You
could mirror the `prettycss` command-line program and make a new
`PrettyCSS` object, then run the parser on a filename or a string containing
CSS.  This also is easier for passing in your own options to control the
pretty printing.

Dependencies
============

The JavaScript code that is used for node.js is bundled up by
[browserify](https://github.com/substack/node-browserify).  This does add an
extra compilation step when testing things in the browser, but it also
provides the benefit that we do not need to change any code to make it work
in the browser and the scripts get transferred as a single file.

The tests are built with [vows](http://vowsjs.org/).  You can run them with
`npm test` or `vows` in the top level directory of the repository.  There's
a lot of tests because we are asserting many little things with each of the
value parsers that we use for handling CSS properties.

Contact
=======

For feature requests, bug reports, or if you want to contribute to the project,
please check out the [GitHub Project Page](https://github.com/fidian/PrettyCSS).

License
=======

This code is provided under a MIT license with additional clauses restricting
promotion with the author's names and an advertising clause.  See 
docs/LICENSE.md for the full details.
