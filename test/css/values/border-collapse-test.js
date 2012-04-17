"use strict";
var util = require('./util');

exports.batch = util.makeVows('border-collapse', {
	'collapse': {
		'tokens': ['IDENT'],
		'toString': 'collapse',
		'unparsed': [],
		'warnings': ['css-minimum:2']
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
