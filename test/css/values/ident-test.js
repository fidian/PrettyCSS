"use strict";
var util = require('./util');

exports.batch = util.makeVows('ident', {
	'7': {
		'tokens': ['UNIT'],
		'toString': null,
		'unparsed': ['UNIT'],
		'warnings': null
	},
	'blah blah': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'blah',
		'unparsed': ['IDENT'],
		'warnings': []
	},
	// Case is NOT preserved unless told to do so by another object
	'PreserveCase': {
		'tokens': ['IDENT'],
		'toString': 'preservecase',
		'unparsed': [],
		'warnings': []
	},
	// inherit is an ident, so parse that normally
	'inherit': {
		'tokens': ['IDENT'],
		'toString': 'inherit',
		'unparsed': [],
		'warnings': []
	}
});
