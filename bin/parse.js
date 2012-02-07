#!/usr/bin/node
var prettycss = require('../lib/prettycss');
var fs = require('fs');
var filenames = process.argv;
filenames.shift(); // Remove "node"
filenames.shift(); // Remove current script
var count = 0;

for (var i = 0; i < filenames.length; i ++) {
	var contents = fs.readFileSync(filenames[i], 'utf-8');
	var result = prettycss.parse(contents, {
		//debug: true
	});
	console.log(result.toString());
	count ++;
}

if (count == 0) {
	console.log('Please pass filenames on the command line');
}
