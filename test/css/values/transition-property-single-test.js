"use strict";
var util = require('./util');

exports.batch = util.makeVows('transition-property-single', {
	'all': {
		'tokens': ['IDENT'],
		'toString': 'all',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'monkey all': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'monkey',
		'unparsed': ['IDENT'],
		'warnings': ['css-minimum:3']
	},
	'76px': {
		'tokens': ['UNIT'],
		'toString': null,
		'unparsed': ['UNIT'],
		'warnings': null
	}
});
