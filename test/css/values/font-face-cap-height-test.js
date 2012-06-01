"use strict";
var util = require('./util');

exports.batch = util.makeVows('font-face-cap-height', {
	'7': {
		'tokens': ['UNIT'],
		'toString': '7',
		'unparsed': [],
		'warnings': ['css-maximum:2', 'css-minimum:2', 'not-forward-compatible:3']
	},
	'7px': {
		'tokens': ['UNIT'],
		'toString': null,
		'unparsed': ['UNIT'],
		'warnings': null
	},
	'88 inherit': {
		'tokens': ['UNIT', 'S', 'IDENT'],
		'toString': '88',
		'unparsed': ['IDENT'],
		'warnings': ['css-maximum:2', 'css-minimum:2', 'not-forward-compatible:3']
	},
	'88.7 88': {
		'tokens': ['UNIT', 'S', 'UNIT'],
		'toString': '88.7',
		'unparsed': ['UNIT'],
		'warnings': ['css-maximum:2', 'css-minimum:2', 'not-forward-compatible:3']
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
