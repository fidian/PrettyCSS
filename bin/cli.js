#!/usr/bin/env node

"use strict";
var prettycss = require('../lib/prettycss');
var fs = require('fs');
var optionparser = require('OptionParser');
var parser = new optionparser.OptionParser();
var options = {
	ignoreWarnings: [],
	stopOnErrors: false,
	stopOnWarnings: false
};

parser.
	addOption('h', 'help', 'Display this help message').
	action(function () {
		console.log("Validate and pretty-print a CSS file");
		console.log("");
		console.log("Usage:");
		console.log("\t" + parser.programName() + " [options] filename [filename [...]]");
		console.log("");
		console.log("Available Options:");
		console.log(parser.help());
		console.log("");
		console.log("When using any of the --stop options, the errors or warnings that caused");
		console.log("a problem will be shown to stderr instead and this program will exit with");
		console.log("an error code of 1.");
		console.log("");
		console.log("Warnings can be ignored by their code.  You can ignore all of the");
		console.log("\"Unsupported Browser\" warnings by using --ignore=browser-unsupported or");
		console.log("specify a value like --ignore=browser-unsupported:ie6 to ignore unsupported");
		console.log("browser errors just for Internet Explorer 6.  All codes can be found");
		console.log("in lib/lang/*.js or on the website.");
		process.exit(0);
	});
parser.
	addOption('i', 'ignore', 'Ignore a type of warning').
	argument('code').
	action(function (arg) {
		options.ignoreWarnings.push(arg);
	});
parser.
	addOption(null, 'stop-on-errors', 'Stop when an error is encountered').
	action(function () {
		options.stopOnErrors = true;
	});
parser.
	addOption(null, 'stop-on-warnings', 'Stop when a warning is encountered').
	action(function () {
		options.stopOnWarnings = true;
	});
parser.
	addOption('s', 'stop-on-problems', 'Same as --stop-on-errors --stop-on-warnings').
	action(function () {
		options.stopOnErrors = true;
		options.stopOnWarnings = true;
	});

var filenames = parser.parse();
filenames.forEach(function (file) {
	parseFile(file);
});

if (filenames.length === 0) {
	console.error('Please pass filenames on the command line');
	console.error('For a list of options, use --help');
}


function parseFile(filename) {
	var contents = fs.readFileSync(filename, 'utf-8');
	var result = prettycss.parse(contents);
	var stop = false;
	var warningCount = 0;
	var errorCount = 0;
	var importantProblems = [];

	// Filter out ignored warnings and count everything
	result.getProblems().forEach(function (item) {
		if (item.typeCode == 'error') {
			importantProblems.push(item);
			errorCount ++;
		} else {
			if (! options.ignoreWarnings.some(function (warning) {
				if (item.code == warning) {
					return true;
				}

				if (warning.substr(0, item.code.length) == item.code &&
					warning.charAt(item.code.length) == ':' &&
					warning.substr(item.code.length + 1) == item.more) {
					return true;
				}

				return false;
			})) {
				importantProblems.push(item);
				warningCount ++;
			}
		}
	});

	if (warningCount || errorCount) {
		var msg;

		if (errorCount == 1) {
			msg = "There was 1 error ";
		} else {
			msg = "There were " + errorCount + " errors ";
		}

		if (warningCount == 1) {
			msg += "and 1 warning detected.";
		} else {
			msg += "and " + warningCount + " warnings detected.";
		}

		console.error(msg);
	}

	importantProblems.forEach(function (item) {
		stop = true;
		var message = item.typeText + ":  " + item.message;

		if (item.token) {
			message += " (" + item.token.content + ", line " + item.token.line + ", char " + item.token.charNum + ")";
		}

		console.error(message);
	});

	if (stop) {
		process.exit(1);
	}

	console.log(result.toString());
}
