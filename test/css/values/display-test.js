"use strict";
var util = require('./util');

exports.batch = util.makeVows('display', {
	'block': {
		'tokens': ['IDENT'],
		'toString': 'block',
		'unparsed': [],
		'warnings': []
	},
	'block "a"': {
		'tokens': ['IDENT', 'S', 'STRING'],
		'toString': 'block "a"',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'"a" block': {
		'tokens': ['STRING', 'S', 'IDENT'],
		'toString': '"a" block',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'"a" blocker': {
		'tokens': ['STRING', 'S', 'IDENT'],
		'toString': '"a"',
		'unparsed': ['IDENT'],
		'warnings': ['css-minimum:3']
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
