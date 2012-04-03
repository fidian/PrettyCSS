"use strict";
var util = require('./util');

exports.batch = util.makeVows('border-width-single', {
	'thin': {
		'tokens': ['IDENT'],
		'toString': 'thin',
		'unparsed': [],
		'warnings': []
	},
	'7em ghoulish': {
		'tokens': ['UNIT', 'S', 'IDENT'],
		'toString': '7em',
		'unparsed': ['IDENT'],
		'warnings': []
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': 'inherit',
		'unparsed': [],
		'warnings': ['minimum_css_version_2']
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
