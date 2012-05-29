"use strict";
var util = require('./util');

exports.batch = util.makeVows('font-face-widths', {
	'12': {
		'tokens': ['UNIT'],
		'toString': '12',
		'unparsed': [],
		'warnings': ['css-minimum:2', 'css-maximum:2']
	},
	'12, 12 kitten': {
		'tokens': ['UNIT', 'OPERATOR', 'S', 'UNIT', 'S', 'IDENT'],
		'toString': '12, 12',
		'unparsed': ['IDENT'],
		'warnings': ['css-minimum:2', 'css-maximum:2']
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
