"use strict";
var util = require('./util');

exports.batch = util.makeVows('text-decoration-css3', {
	'underline': {
		'tokens': ['IDENT'],
		'toString': 'underline',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'#f00': {
		'tokens': ['HASH'],
		'toString': '#f00',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'blink': {
		'tokens': ['IDENT'],
		'toString': 'blink',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'solid jiaidjijd': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'solid',
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
