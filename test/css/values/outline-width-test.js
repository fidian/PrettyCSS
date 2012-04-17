"use strict";
var util = require('./util');

exports.batch = util.makeVows('outline-width', {
	'thin': {
		'tokens': ['IDENT'],
		'toString': 'thin',
		'unparsed': [],
		'warnings': ['css-minimum:2']
	},
	'inherit thin': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'inherit',
		'unparsed': ['IDENT'],
		'warnings': ['css-minimum:2']
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
