#!/usr/bin/node
var tokenizer = require('../lib/tokenizer');
var fs = require('fs');
var filenames = process.argv;
filenames.shift(); // Remove "node"
filenames.shift(); // Remove current script
var count = 0;

for (var i = 0; i < filenames.length; i ++) {
	var contents = fs.readFileSync(filenames[i], 'utf-8');
	var result = tokenizer.tokenize(contents);
	process.stdout.write("[\n");

	for (var i = 0; i < result.tokens.length; i ++) {
		if (i) {
			process.stdout.write(",\n");
		}

		var j = JSON.stringify(result.tokens[i]);
		process.stdout.write("\t" + j);
	}
	process.stdout.write("\n]\n");
	count ++;
}

if (count == 0) {
	console.log('Please pass filenames on the command line');
}
