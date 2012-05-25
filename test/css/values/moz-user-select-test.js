"use strict";
var util = require('./util');

exports.batch = util.makeVows('moz-user-select', {
	'text': {
		'tokens': ['IDENT'],
		'toString': 'text',
		'unparsed': [],
		'warnings': []
	},
	'all inherit': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'all',
		'unparsed': ['IDENT'],
		'warnings': []
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': 'inherit',
		'unparsed': [],
		'warnings': []
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
