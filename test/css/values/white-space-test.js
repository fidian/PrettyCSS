"use strict";
var util = require('./util');

exports.batch = util.makeVows('white-space', {
	'normal': {
		'tokens': ['IDENT'],
		'toString': 'normal',
		'unparsed': [],
		'warnings': []
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': 'inherit',
		'unparsed': [],
		'warnings': ['css-minimum:2']
	},
	'pre-wrap blue': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'pre-wrap',
		'unparsed': ['IDENT'],
		'warnings': ['css-minimum:3']
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
