"use strict";
var util = require('./util');

exports.batch = util.makeVows('font-style', {
	'normal': {
		'tokens': ['IDENT'],
		'toString': 'normal',
		'unparsed': [],
		'warnings': []
	},
	'italic oblique': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'italic',
		'unparsed': ['IDENT'],
		'warnings': []
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': 'inherit',
		'unparsed': [],
		'warnings': ['css-minimum:2']
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
