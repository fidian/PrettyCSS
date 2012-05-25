"use strict";
var util = require('./util');

exports.batch = util.makeVows('to-side-or-corner', {
	'to left top': {
		'tokens': ['IDENT', 'S', 'IDENT', 'S', 'IDENT'],
		'toString': 'to left top',
		'unparsed': [],
		'warnings': []
	},
	'to top left': {
		'tokens': ['IDENT', 'S', 'IDENT', 'S', 'IDENT'],
		'toString': 'to top left',
		'unparsed': [],
		'warnings': []
	},
	'to left left': {
		'tokens': ['IDENT', 'S', 'IDENT', 'S', 'IDENT'],
		'toString': 'to left',
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
