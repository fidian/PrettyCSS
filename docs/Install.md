Installation Instructions
=========================

There are many different ways you can install PrettyCSS.  Pick the method that best suits your needs.

* Global installation - Installs a binary that is usable by everyone through a command-line interface
* Local installation - Installs the package into a directory of your choosing, again employing the command line interface
* Library in your JS project - Lets you use the engine directly in your JavaScript
* Git submodules - Skip the whole "npm" thing or use as a submodule
* Web based - Only need to get this running in a browser or do you very rarely need it?  Why download anything at all?

Prerequisites
-------------

Unless you only intend to run this in your web browser, you need to install [node.js] first.  See their homepage for more information.

[node.js]: http://nodejs.org

Global Installation
-------------------

This installs PrettyCSS and lets you use the prettycss command-line interface right away.  It requires root permissions on a Linux machine.

```
sudo npm -g install PrettyCSS
```

Local Installation
------------------

You can do basically the same thing as a global installation by running npm in a directory of your choosing.  PrettyCSS will be downloaded and installed into `./node_modules/PrettyCSS` and the binary will be in `./node_modules/.bin/prettycss`.  Adding that directory to your PATH will let you run `prettycss` from the command line.

```
npm install PrettyCSS
```

Library in your JS Project
--------------------------

If you are already writing a JavaScript project, you probably already have a `package.json` file to let `npm install` automatically install dependencies for you.  If not, see npm's homepage.  To get PrettyCSS downloaded, you will need to add this line in your dependencies.

```
"dependencies": {
    "PrettyCSS": "*"
},
```

After that, `npm install` will download and get the code for you plus install the program at `./node_modules/.bin/prettycss`.

Git Submodule
-------------

Another way to get this into your codebase would be to add it as a git submodule.  In this example, we have a directory called `3rd_party/` to keep libraries from other people separate from our code.  Inside of there, all node modules will go into `3rd_party/node_modules/` so they can find each other.  Install PrettyCSS and OptionParser's git repositories as submodules by running these commands in the top level of your existing git repository.

```
mkdir -p 3rd_party/node_modules
git submodule add https://github.com/tests-always-included/option-parser-js.git 3rd_party/node_modules/option-parser
git submodule add https://github.com/fidian/PrettyCSS.git 3rd_party/node_modules/PrettyCSS
git commit -m 'Adding PrettyCSS and dependent library'
```

The command-line version is now in `3rd_party/node_modules/PrettyCSS/bin/prettycss`.

Web Based
---------

Depending on your needs, you could just download [bundle.js] and put it into your codebase.  Alternately, you can use the Git Submodule technique or install with npm like any of the above methods.  Those all install the entire library, test suite, command-line programs and everything else.  When you get the complete repository, you can check out the `www/` directory for a working, static HTML demo that you can use to beautify and check your CSS.

[bundle.js]: ../www/bundle.js

Other Methods
-------------

If you plan on making a service of the PrettyCSS tool, you will need to have
some server-side version of JavaScript.  I suggest taking a look at [node.js]
since it is the easiest one I have ever set up and it's also screaming fast.
This is a list of some server-side JavaScript engines:

* [node.js](http://nodejs.org) - Uses V8 underneath
* [Rhino](http://www.mozilla.org/rhino/) - Java based, from Mozilla
* [SpiderMonkey](https://developer.mozilla.org/en/SpiderMonkey) - C based, from Mozilla

If you have the intent of developing this software, you will need to rebundle
the web-based version of the code.  For that task, you will need to run browserify, and that's easily installed with npm.
