"use strict";
var util = require('./util');

exports.batch = util.makeVows('ms-side-or-corner', {
	'left': {
		'tokens': ['IDENT'],
		'toString': 'left',
		'unparsed': [],
		'warnings': []
	},
	'top inherit': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'top',
		'unparsed': ['IDENT'],
		'warnings': []
	},
	'left top': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'left top',
		'unparsed': [],
		'warnings': []
	},
	'top left': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'top',
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
