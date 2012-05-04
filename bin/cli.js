#!/usr/bin/node

"use strict";
var prettycss = require('../lib/prettycss');
var fs = require('fs');

var filenames = process.argv;
filenames.shift(); // Remove "node"
filenames.shift(); // Remove current script
var filesParsed = 0;
var options = {
	ignoreWarnings: [],
	stopOnErrors: false,
	stopOnWarnings: false
};

for (var i = 0; i < filenames.length; i ++) {
	switch (filenames[i]) {
		case '--help':
		case '-h':
			help();
			process.exit();
			break;

		case '--ignore':
		case '-i':
			i ++;
			options.ignoreWarnings.push(filenames[i]);
			break;

		case '--stop-on-problem':
		case '-s':
			options.stopOnErrors = true;
			options.stopOnWarnings = true;
			break;

		case '--stop-on-errors':
			options.stopOnErrors = true;
			break;

		case '--stop-on-warnings':
			options.stopOnWarnings = true;
			break;

		default:
			parseFile(filenames[i]);
			filesParsed ++;
			break;
	}
}

if (filesParsed === 0) {
	console.error('Please pass filenames on the command line');
	console.error('For a list of options, use --help');
}


function help() {
	console.log("Validate and pretty-print a CSS file");
	console.log("Options:");
	console.log(" -h, --help = What you are reading right now");
	console.log(" --stop-on-errors = Stop when an error is hit");
	console.log(" --stop-on-warnings = Stop when a warning is hit");
	console.log(" -s, --stop-on-problem = Stop when a warning or an error is hit");
	console.log("");
	console.log("When using any of the --stop options, the errors or warnings that caused");
	console.log("a problem will be shown to stderr instead and this program will exit with");
	console.log("an error code of 1.\n");
}

function parseFile(filename) {
	var contents = fs.readFileSync(filename, 'utf-8');
	var result = prettycss.parse(contents);
	var stop = false;

	result.getProblems().forEach(function (item) {
		var ignored = false;
		if (! options.ignoreWarnings.some(function (warning) {
			return item.code == warning;
		})) {
			stop = true;
			var message = item.typeText + ":  " + item.message;

			if (item.token) {
				message += " (" + item.token.content + ", line " + item.token.line + ", char " + item.token.charNum + ")";
			}
			console.error(message);
		}
	});

	if (stop) {
		process.exit(1);
	}

	console.log(result.toString());
}
