"use strict";
var util = require('./util');

exports.batch = util.makeVows('box-shadow-single', {
	'8px 8px' : {
		'tokens': ['UNIT','S', 'UNIT'],
		'toString': '8px 8px',
		'unparsed': [],
		'warnings': ['minimum_css_version_3']
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': 'inherit',
		'unparsed': [],
		'warnings': ['minimum_css_version_3', 'minimum_css_version_2' ]
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
