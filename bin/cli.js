#!/usr/bin/node

"use strict";
var prettyCss = require('../lib/prettycss.js');
var fs = require('fs');

var parsed = prettyCss.parseString(fs.readFileSync('../README.md'));
