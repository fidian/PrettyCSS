"use strict";
var util = require('./util');

exports.batch = util.makeVows('animation-direction', {
	'normal': {
		'tokens': ['IDENT'],
		'toString': 'normal',
		'unparsed': [],
		'warnings': []
	},
	'reverse normal': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'reverse',
		'unparsed': ['IDENT'],
		'warnings': []
	},
	'reverse, normal': {
		'tokens': ['IDENT', 'OPERATOR', 'S', 'IDENT'],
		'toString': 'reverse, normal',
		'unparsed': [],
		'warnings': []
	},
	'reverse, inherit': {
		'tokens': ['IDENT', 'OPERATOR', 'S', 'IDENT'],
		'toString': 'reverse',
		'unparsed': ['OPERATOR', 'S', 'IDENT'],
		'warnings': []
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': 'inherit',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
