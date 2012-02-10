#!/usr/bin/node
var prettycss = require('../lib/prettycss');
var fs = require('fs');
var filenames = process.argv;
filenames.shift(); // Remove "node"
filenames.shift(); // Remove current script
var count = 0;
var parseOptions = true;
var parseFiles = true;
var options = {
	debug: false
};

for (var i = 0; i < filenames.length; i ++) {
	var parseThisFile = true;

	if (parseOptions) {
		parseThisFile = false;

		switch (filenames[i]) {
			case '--debug':
			case '-d':
				options.debug = true;
				break;

			case '--help':
			case '-h':
				help();
				parseOptions = false;
				parseFiles = false;
				break;

			case '--':
				parseOptions = false;
				break;

			default:
				parseThisFile = true;
		}
	}

	if (parseFiles && parseThisFile) {
		var contents = fs.readFileSync(filenames[i], 'utf-8');
		var result = prettycss.parse(contents, options);
		console.log(result.toString());
		count ++;
	}
}

if (count == 0) {
	console.log('Please pass filenames on the command line');
}

function help() {
	console.log("Parse a CSS file");
	console.log("Options:");
	console.log(" -h = Help (what you are reading right now)");
	console.log(" -d = Debug mode");
}
