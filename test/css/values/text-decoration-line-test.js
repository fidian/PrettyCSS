"use strict";
var util = require('./util');

exports.batch = util.makeVows('text-decoration-line', {
	'inherit': {
		'tokens': ['IDENT'],
		'toString': 'inherit',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'overline underline line-through underline': {
		'tokens': ['IDENT', 'S', 'IDENT', 'S', 'IDENT', 'S', 'IDENT'],
		'toString': 'overline underline line-through',
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
