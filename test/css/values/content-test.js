"use strict";
var util = require('./util');

exports.batch = util.makeVows('content', {
	'inherit': {
		'tokens': ['IDENT'],
		'toString': 'inherit',
		'unparsed': [],
		'warnings': ['minimum_css_version_2']
	},
	'none "omg"': {
		'tokens': ['IDENT', 'S', 'STRING'],
		'toString': 'none',
		'unparsed': ['STRING'],
		'warnings': ['minimum_css_version_2']
	},
	'"thing1" "thing2" thing3': {
		'tokens': ['STRING', 'S', 'STRING', 'S', 'IDENT'],
		'toString': '"thing1" "thing2"',
		'unparsed': ['IDENT'],
		'warnings': ['minimum_css_version_2']
	},
	// Inherit doesn't match the repeat parser, so it stops there
	'"thing1" inherit "thing2" thing3': {
		'tokens': ['STRING', 'S', 'IDENT', 'S', 'STRING', 'S', 'IDENT'],
		'toString': '"thing1"',
		'unparsed': ['IDENT', 'S', 'STRING', 'S', 'IDENT'],
		'warnings': ['minimum_css_version_2']
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
