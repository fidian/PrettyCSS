Basics
======

First off, if you just want to use PrettyCSS in your browser, you do not need
to install anything complex.  Just copy the files from the www/ directory
to somewhere that a browser can use them and then visit the index page.
From there, you should be off and running, able to beautify CSS text that
you copied and pasted in or a file that is served from the web.

If you plan on making a service of the PrettyCSS tool, you will need to have
some server-side version of JavaScript.  I suggest taking a look at node.js
since it is the easiest one I have ever set up and it's also screaming fast.
This is a list of some server-side JavaScript engines:

* [node.js](http://nodejs.org) - Uses V8 underneath
* [Rhino](http://www.mozilla.org/rhino/) - Java based, from Mozilla
* [SpiderMonkey](https://developer.mozilla.org/en/SpiderMonkey) - C based,
  from Mozilla

If you have the intent of developing this software, you will need to rebundle
the web-based version of the code.  To do that, you will need node.js and
[npm](http://npmjs.org) installed so you can get browserify.

Node.js
=======

On a Debian, Ubuntu or other apt-based system, as root:

	apt-get install python-software-properties
	add-apt-repository ppa:chris-lea/node.js
	apt-get update
	apt-get install nodejs

On Redhat, Centos or other yum-based system, as root:

	yum localinstall --nogpgcheck http://nodejs.tchol.org/repocfg/fedora/nodejs-stable-release.noarch.rpm
	yum install nodejs

From source; either download from the website or get a clone of the git
repository.

	cd node-source-code-directory
	./configure
	make
	sudo make install

NPM
===

NPM is now a part of node, so you should either have it already or else
you may need to install the npm package or similar.

PrettyCSS
=========

From here, you should be able to use `npm install PrettyCSS` and it will
download everything for you.  For additional installation options, check out
http://www.fidian.com/prettycss/installation
