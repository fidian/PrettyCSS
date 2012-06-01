"use strict";
var util = require('./util');

exports.batch = util.makeVows('box-sizing', {
	'content-box': {
		'tokens': ['IDENT'],
		'toString': 'content-box',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'border-box inherit': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'border-box',
		'unparsed': ['IDENT'],
		'warnings': ['css-minimum:3']
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
