"use strict";

var util = require('./util');

exports.batch = util.makeVows('background-position', {
	'top': {
		'tokens': ['IDENT'],
		'toString': 'top',
		'unparsed': [],
		'warnings': []
	},
	'top right': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'right top',
		'unparsed': [],
		'warnings': []
	},
	'ijai adfasdf ': {
		'tokens': ['IDENT', 'S', 'IDENT', 'S'],
		'toString': null,
		'unparsed': ['IDENT', 'S', 'IDENT', 'S'],
		'warnings': []
	}
});
