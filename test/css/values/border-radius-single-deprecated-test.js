"use strict";
var util = require('./util');

exports.batch = util.makeVows('border-radius-single-deprecated', {
	'5px': {
		'tokens': ['UNIT'],
		'toString': '5px',
		'unparsed': [],
		'warnings': ['deprecated_css_use_border-radius']
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
