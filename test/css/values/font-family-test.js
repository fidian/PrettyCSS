"use strict";
var util = require('./util');

exports.batch = util.makeVows('font-family', {
	'Times': {
		'tokens': ['IDENT'],
		'toString': 'Times',
		'unparsed': [],
		'warnings': ['font-family-one-generic']
	},
	'Times New Roman': {
		'tokens': ['IDENT', 'S', 'IDENT', 'S', 'IDENT'],
		'toString': 'Times New Roman',
		'unparsed': [],
		'warnings': ['font-family-one-generic']
	},
	'serif, "Times New Roman"': {
		'tokens': ['IDENT', 'OPERATOR', 'S', 'STRING'],
		'toString': 'serif, "Times New Roman"',
		'unparsed': [],
		'warnings': ['font-family-one-generic']
	},
	'"Times New Roman", serif': {
		'tokens': ['STRING', 'OPERATOR', 'S', 'IDENT'],
		'toString': '"Times New Roman", serif',
		'unparsed': [],
		'warnings': []
	},
	'serif "Times New Roman"': {
		'tokens': ['IDENT', 'S', 'STRING'],
		'toString': 'serif',
		'unparsed': ['STRING'],
		'warnings': []
	},
	'"Times New Roman" serif': {
		'tokens': ['STRING', 'S', 'IDENT'],
		'toString': '"Times New Roman"',
		'unparsed': ['IDENT'],
		'warnings': ['font-family-one-generic']
	},
	'valid, inherit': {
		'tokens': ['IDENT', 'OPERATOR', 'S', 'IDENT'],
		'toString': 'valid, inherit',
		'unparsed': [],
		'warnings': ['font-family-one-generic', 'inherit-not-allowed']
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': 'inherit',
		'unparsed': [],
		'warnings': ['css-minimum:2']
	},
	'76em': {
		'tokens': ['UNIT'],
		'toString': null,
		'unparsed': ['UNIT'],
		'warnings': null
	}
});
