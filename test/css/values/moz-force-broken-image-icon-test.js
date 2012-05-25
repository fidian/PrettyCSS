"use strict";
var util = require('./util');

exports.batch = util.makeVows('moz-force-broken-image-icon', {
	'2': {
		'tokens': ['UNIT'],
		'toString': '1',  // autocorrect
		'unparsed': [],
		'warnings': ['range-max:1']
	},
	'1 inherit': {
		'tokens': ['UNIT', 'S', 'IDENT'],
		'toString': '1',
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
