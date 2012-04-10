"use strict";
var util = require('./util');

exports.batch = util.makeVows('string', {
	"'valid'": {
		'tokens': ['STRING'],
		'toString': "'valid'",
		'unparsed': [],
		'warnings': []
	},
	'"validValue"': {
		'tokens': ['STRING'],
		'toString': '"validValue"',
		'unparsed': [],
		'warnings': []
	}
});
