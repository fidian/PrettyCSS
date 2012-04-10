"use strict";
var util = require('./util');

exports.batch = util.makeVows('row-height', {
	'100px': {
		'tokens': ['UNIT'],
		'toString': '100px',
		'unparsed': [],
		'warnings': ['minimum_css_version_3']
	},
	'-100px': {
		'tokens': ['UNIT'],
		'toString': '-100px',
		'unparsed': [],
		'warnings': ['minimum_css_version_3', 'positive_value_required']
	},
	'100px 500px': {
		'tokens': ['UNIT', 'S', 'UNIT'],
		'toString': '100px',
		'unparsed': ['UNIT'],
		'warnings': ['minimum_css_version_3']
	},
	'100px, inherit': {
		'tokens': ['UNIT', 'OPERATOR', 'S', 'IDENT'],
		'toString': '100px',
		'unparsed': ['OPERATOR', 'S', 'IDENT'],
		'warnings': ['minimum_css_version_3']
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
