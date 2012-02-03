#!/usr/bin/node
var start = new Date();
var tokenizer = require('../lib/tokenizer');
var end = new Date();
var initTime = end - start;
console.log("init:  " + initTime);
var fs = require('fs');
var contents = fs.readFileSync(__dirname + '/../test/css/styles.css', 'utf-8');

var total = 0;
var loops = 10;
for (var i = 0; i < loops; i ++) {
	start = new Date();
	tokenizer.tokenize(contents);
	end = new Date();
	var elapsed = end - start;
	console.log(elapsed);
	total += elapsed;
}

console.log("TOTAL: " + total);
console.log("  AVG: " + Math.round(total / loops));
console.log(" INIT: " + initTime);
