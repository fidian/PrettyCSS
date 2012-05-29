"use strict";
var util = require('./util');

exports.batch = util.makeVows('font-face-x-height', {
	'12': {
		'tokens': ['UNIT'],
		'toString': '12',
		'unparsed': [],
		'warnings': ['css-maximum:2', 'css-minimum:2', 'not-forward-compatible:3']
	},
	'12 inherit': {
		'tokens': ['UNIT', 'S', 'IDENT'],
		'toString': '12',
		'unparsed': ['IDENT'],
		'warnings': ['css-maximum:2', 'css-minimum:2', 'not-forward-compatible:3']
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
