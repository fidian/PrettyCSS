"use strict";
var util = require('./util');

exports.batch = util.makeVows('text-decoration', {
	'none': {
		'tokens': ['IDENT'],
		'toString': 'none',
		'unparsed': [],
		'warnings': []
	},
	'underline overline': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'underline overline',
		'unparsed': [],
		'warnings': []
	},
	'underline overline line-through blink': {
		'tokens': ['IDENT', 'S', 'IDENT', 'S', 'IDENT', 'S', 'IDENT'],
		'toString': 'underline overline line-through blink',
		'unparsed': [],
		'warnings': []
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': 'inherit',
		'unparsed': [],
		'warnings': []
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
