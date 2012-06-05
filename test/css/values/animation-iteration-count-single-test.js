"use strict";
var util = require('./util');

exports.batch = util.makeVows('animation-iteration-count-single', {
	'infinite': {
		'tokens': ['IDENT'],
		'toString': 'infinite',
		'unparsed': [],
		'warnings': []
	},
	'7 infinite': {
		'tokens': ['UNIT', 'S', 'IDENT'],
		'toString': '7',
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
