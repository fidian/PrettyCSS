"use strict";
var util = require('./util');

exports.batch = util.makeVows('background-origin', {
	'border-box': {
		'tokens': ['IDENT'],
		'toString': 'border-box',
		'unparsed': [],
		'warnings': []
	},
	'padding-box border-box blah': {
		'tokens': ['IDENT', 'S', 'IDENT', 'S', 'IDENT'],
		'toString': 'padding-box',
		'unparsed': ['IDENT', 'S', 'IDENT'],
		'warnings': []
	},
	'padding-box, border-box, blah': {
		'tokens': ['IDENT', 'OPERATOR', 'S', 'IDENT', 'OPERATOR', 'S', 'IDENT'],
		'toString': 'padding-box, border-box',
		'unparsed': ['OPERATOR', 'S', 'IDENT'],
		'warnings': []
	},
	'border-box, inherit': {
		'tokens': ['IDENT', 'OPERATOR', 'S', 'IDENT'],
		'toString': 'border-box, inherit',
		'unparsed': [],
		'warnings': ['inherit-not-allowed']
	},
	'url(a) alsjdjd': {
		'tokens': ['URL', 'S', 'IDENT'],
		'toString': null,
		'unparsed': ['URL', 'S', 'IDENT'],
		'warnings': null
	}
});
