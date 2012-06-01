"use strict";
var util = require('./util');

exports.batch = util.makeVows('font-face-feature-tag-value', {
	'"blue"': {
		'tokens': ['STRING'],
		'toString': '"blue"',
		'unparsed': [],
		'warnings': []
	},
	'"garadox" 7': {
		'tokens': ['STRING', 'S', 'UNIT'],
		'toString': '"garadox" 7',
		'unparsed': [],
		'warnings': []
	},
	'"garadox" 7.5': {
		'tokens': ['STRING', 'S', 'UNIT'],
		'toString': '"garadox"',
		'unparsed': ['UNIT'],
		'warnings': []
	},
	'"garadox" on': {
		'tokens': ['STRING', 'S', 'IDENT'],
		'toString': '"garadox" on',
		'unparsed': [],
		'warnings': []
	},
	'"garadox" of': {
		'tokens': ['STRING', 'S', 'IDENT'],
		'toString': '"garadox"',
		'unparsed': ['IDENT'],
		'warnings': []
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
