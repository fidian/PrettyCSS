#!/usr/bin/env node

"use strict";
var minify = false;
var http = require('http');
var path = require('path');
var querystring = require('querystring');
var fs = require('fs');

// Parse any arguments
var args = process.argv;
args.shift(); // Remove "node"
args.shift(); // Remove current script

for (var i = 0; i < args.length; i ++) {
	switch (args[i]) {
		case '-m':
		case '--minify':
			minify = true;
			break;

		default:
			console.log("Unknown option: " + args[i]);
			console.log("");
			console.log("Available options:");
			console.log("-m / --minify = also minify the file");
			process.exit();
			break;
	}
}

// bundle everything into a single file/string
var libdir = path.resolve(__dirname, '../lib');
var browserify = require('browserify');
var bundle = browserify();
process.chdir(libdir);
bundle.require('./prettycss', {
	root: libdir
});
var codeString = bundle.bundle();

console.log("Writing to www/bundle.js");
fs.writeFileSync(__dirname + "/../www/bundle.js", codeString, "utf-8");

if (! minify) {
	process.exit();
}

// Build the post string from an object
var postData = querystring.stringify({
	//'compilation_level' : 'ADVANCED_OPTIMIZATIONS',
	'compilation_level' : 'SIMPLE_OPTIMIZATIONS',
	'output_format': 'json',
	'js_code' : codeString
}) + "&output_info=compiled_code&output_info=warnings&output_info=errors&output_info=statistics";

var postOptions = {
	host: "closure-compiler.appspot.com",
	port: '80',
	path: '/compile',
	method: 'POST',
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
		'Content-Length': postData.length
	}
};

// Set up the request
var postReq = http.request(postOptions, function(res) {
	res.setEncoding('utf8');
	var data = "";
	res.on('data', function (chunk) {
		data += chunk;
	});
	res.on('end', function (){
		var result = JSON.parse(data);

		//console.log(result);

		if (result.compiledCode) {
			console.log("Writing to www/bundle-min.js");
			fs.writeFileSync(__dirname + "/../www/bundle-min.js", result.compiledCode, "utf-8");
		}

		if (result.warnings) {
			for (var i1 = 0; i1 < result.warnings.length; i1 ++) {
				var item1 = result.warnings[i];
				console.log("WARNING line " + item1.lineno + ": " + item1.warning);
			}
		}

		if (result.errors) {
			for (var i2 = 0; i2 < result.errors.length; i2 ++) {
				var item2 = result.errors[j];
				console.log("ERRORS line " + item2.lineno + ": " + item2.error);
			}
		}
	});
});

// post the data
postReq.write(postData);
postReq.end();
