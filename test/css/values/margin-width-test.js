"use strict";
var util = require('./util');

exports.batch = util.makeVows('margin-width', {
	'88em': {
		'tokens': ['UNIT'],
		'toString': '88em',
		'unparsed': [],
		'warnings': []
	},
	'-233% Blah': {
		'tokens': ['UNIT', 'S', 'IDENT'],
		'toString': '-233%',
		'unparsed': ['IDENT'],
		'warnings': []
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
