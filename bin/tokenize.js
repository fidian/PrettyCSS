#!/usr/bin/node
var tokenizer = require('../lib/tokenizer');
var fs = require('fs');
var contents = fs.readFileSync(__dirname + '/test/css/simple.css', 'utf-8');
var result = tokenizer.tokenize(contents);
console.log(result);
