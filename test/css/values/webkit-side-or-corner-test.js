"use strict";
var util = require('./util');

exports.batch = util.makeVows('webkit-side-or-corner', {
	'left': {
		'tokens': ['IDENT'],
		'toString': 'left',
		'unparsed': [],
		'warnings': []
	},
	'top left': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'top',
		'unparsed': ['IDENT'],
		'warnings': []
	},
	'top': {
		'tokens': ['IDENT'],
		'toString': 'top',
		'unparsed': [],
		'warnings': []
	},
	'left top': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'left top',
		'unparsed': [],
		'warnings': []
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
