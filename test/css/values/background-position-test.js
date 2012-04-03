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
		'toString': 'top right',
		'unparsed': [],
		'warnings': []
	}
});
