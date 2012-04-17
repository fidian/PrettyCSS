"use strict";
var util = require('./util');

exports.batch = util.makeVows('outline-style', {
	'groove': {
		'tokens': ['IDENT'],
		'toString': 'groove',
		'unparsed': [],
		'warnings': ['css-minimum:2']
	},
	'dotted groove': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'dotted',
		'unparsed': ['IDENT'],
		'warnings': ['css-minimum:2']
	},
	'groove inherit': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'groove',
		'unparsed': ['IDENT'],
		'warnings': ['css-minimum:2']
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': 'inherit',
		'unparsed': [],
		'warnings': ['css-minimum:2']
	},
	'auto': {
		'tokens': ['IDENT'],
		'toString': 'auto',
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
