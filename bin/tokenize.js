#!/usr/bin/node
var tokenizer = require('../lib/tokenizer');
var fs = require('fs');
var filenames = process.argv;
filenames.shift(); // Remove "node"
filenames.shift(); // Remove current script
count = 0;

for (var i = 0; i < filenames.length; i ++) {
	var contents = fs.readFileSync(filenames[i], 'utf-8');
	var result = tokenizer.tokenize(contents);
	console.log(result.toString());
	count ++;
}

if (count == 0) {
	console.log('Please pass filenames on the command line');
}
