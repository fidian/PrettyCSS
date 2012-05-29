"use strict";
var util = require('./util');

exports.batch = util.makeVows('font-face-mathline', {
	'12': {
		'tokens': ['UNIT'],
		'toString': '12',
		'unparsed': [],
		'warnings': ['css-maximum:2', 'css-minimum:2', 'not-forward-compatible:3']
	},
	'1 2': {
		'tokens': ['UNIT', 'S', 'UNIT'],
		'toString': '1',
		'unparsed': ['UNIT'],
		'warnings': ['css-maximum:2', 'css-minimum:2', 'not-forward-compatible:3']
	},
	'-112': {
		'tokens': ['UNIT'],
		'toString': '-112',
		'unparsed': [],
		'warnings': ['css-maximum:2', 'css-minimum:2', 'not-forward-compatible:3']
	},
	'0': {
		'tokens': ['UNIT'],
		'toString': '0',
		'unparsed': [],
		'warnings': ['css-maximum:2', 'css-minimum:2', 'not-forward-compatible:3']
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	},
	'all': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
