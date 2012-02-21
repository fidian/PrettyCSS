Description
===========

PrettyCSS is a project to make a CSS3-compliant parser, lint checker, and
pretty printer.  With this tool we will be able to check for CSS format
violations and then will beautify the code to standardize it.  With another
configuration you are able to crunch your styles down as much as possible
and will just ignore the warnings.

This was created because there were no tools that I could download and use
on my own computer that also handled CSS3.

The PrettyCSS project is on [GitHub](https://github.com/fidian/prettycss/).
Further documentation is at http://fidian.com/PrettyCSS
List of authors is at docs/AUTHORS.md

Installation
============

It isn't too hard to get this set up.  If you plan on using this on your
server, I think that [node.js](http://nodejs.org/) is one of the easiest
JavaScript implementations to get running.  If you are going to do
development and will be rebundling the code into the browser-centric version,
you will need node.js and [npm](http://npmjs.org/) to run browserify.

See docs/INSTALL.md for further information.

Usage
=====

Still working on this one.  Bug me to update the README.md for the project.

The easiest way is to use the web interface by opening www/test.html in
your favorite browser.

This can also be linked into your existing JavaScript code, such as what you
might be writing with [node.js](http://nodejs.org/).

Dependencies
============

The JavaScript code that is used for node.js is bundled up by
[browserify](https://github.com/substack/node-browserify).  This does add an
extra compilation step when testing things in the browser, but it also
provides the benefit that we do not need to change any code to make it work
in the browser and the scripts get transferred as a single file.

Contact
=======

For feature requests, bug reports, and to get additional information, email
fidian@rumkin.com or contact me via [GitHub](https://github.com/fidian/).

License
=======

This code is provided under a MIT license with additional clauses restricting
promotion with the author's names and an advertising clause.  See 
docs/LICENSE.md for the full details.

