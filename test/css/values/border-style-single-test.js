"use strict";
var util = require('./util');

exports.batch = util.makeVows('border-style-single', {
	'groove': {
		'tokens': ['IDENT'],
		'toString': 'groove',
		'unparsed': [],
		'warnings': []
	},
	'double nocomma_and_garbage': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'double',
		'unparsed': ['IDENT'],
		'warnings': []
	},
	// Inherit is illegal for this object
	'inherit': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
