Changelog
=========

v0.3.10
-------

* 0.3.9 had an issue where the wrong version of option-parser could be used.
* 0.3.9 also was released using "OptionParser" (the old version).  I tagged and pushed the wrong commit. (Issue [#34](https://github.com/fidian/PrettyCSS/issues/34))

v0.3.9
-------

* Switched to use tests-always-included/option-parser-js (the fidian/OptionParser repository was moved and reworked)

v0.3.8
------

* Rudimentary support for "-" as stdin
* Documentation updates

v0.3.7
------

* Added `:nth-child()` support

v0.3.6
------

* Added `table-layout`, a CSS2 property

v0.3.5
------

* Corrected URL pattern for significant speed improvement on minified CSS

v0.3.4
------

* Renamed bin/* files to remove ".js" at the end
* Feature - Additional CSS parsing rules

v0.3.3
------

* Bugfix issue #6 - Should use `/bin/env node` instead of `/usr/bin/node`
* Bugfix - correct ignored warnings in command-line version
* Feature - Adding detection of star and underscore hacks
* Feature - Additional CSS parsing rules
* Bugfix - correcting webkit-side-or-corner
* Bugfix - corrected key for language encoding of a message

v0.3.2
------

* Use OptionParser for command line program's options
* Bugfix - fixing newlines in comments being reindented

v0.3.1
------

* Bugfix - some properties need to be case sensitive

v0.3.0
------

* Added many more tests - now to a good spot with tests

v0.2.0
------

* Added live HTML view
* Parsing values and validating that the property's value seems correct
* Added many tests, but not complete coverage of anything

v0.1.0
------

* Can tokenize CSS
* Can parse tokens into CSS objects
* Has tests for each of the CSS objects and for the tokenizer
* A couple scripts that are useful for testing changes
* Initial stab at documentation
* Web-based textarea test page with live updates
* Error detection for formats that are invalid
* Manages all whitespace and works as a beautifier
