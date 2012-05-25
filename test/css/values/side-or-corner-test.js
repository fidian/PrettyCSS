"use strict";
var util = require('./util');

exports.batch = util.makeVows('side-or-corner', {
	'left top': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'left top',
		'unparsed': [],
		'warnings': []
	},
	'top left': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'top left',
		'unparsed': [],
		'warnings': []
	},
	'left left': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'left',
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
