"use strict";
var util = require('./util');

exports.batch = util.makeVows('empty-cells', {
	'show': {
		'tokens': ['IDENT'],
		'toString': 'show',
		'unparsed': [],
		'warnings': ['css-minimum:2']
	},
	'hide inherit': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'hide',
		'unparsed': ['IDENT'],
		'warnings': ['css-minimum:2']
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
