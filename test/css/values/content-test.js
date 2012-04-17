"use strict";
var util = require('./util');

exports.batch = util.makeVows('content', {
	'inherit': {
		'tokens': ['IDENT'],
		'toString': 'inherit',
		'unparsed': [],
		'warnings': ['css-minimum:2']
	},
	'none "omg"': {
		'tokens': ['IDENT', 'S', 'STRING'],
		'toString': 'none',
		'unparsed': ['STRING'],
		'warnings': ['css-minimum:2']
	},
	'"thing1" "thing2" thing3': {
		'tokens': ['STRING', 'S', 'STRING', 'S', 'IDENT'],
		'toString': '"thing1" "thing2"',
		'unparsed': ['IDENT'],
		'warnings': ['css-minimum:2']
	},
	// Inherit doesn't match the repeat parser, so it stops there
	'"thing1" inherit "thing2" thing3': {
		'tokens': ['STRING', 'S', 'IDENT', 'S', 'STRING', 'S', 'IDENT'],
		'toString': '"thing1"',
		'unparsed': ['IDENT', 'S', 'STRING', 'S', 'IDENT'],
		'warnings': ['css-minimum:2']
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
