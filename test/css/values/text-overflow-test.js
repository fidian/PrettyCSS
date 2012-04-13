"use strict";
var util = require('./util');

exports.batch = util.makeVows('text-overflow', {
	'clip': {
		'tokens': ['IDENT'],
		'toString': 'clip',
		'unparsed': [],
		'warnings': ['minimum_css_version_3']
	},
	'ellipsis "wonderboy" clip': {
		'tokens': ['IDENT', 'S', 'STRING', 'S', 'IDENT'],
		'toString': 'ellipsis "wonderboy"',
		'unparsed': ['IDENT'],
		'warnings': ['minimum_css_version_3']
	},
	'ellipsis, "wonderboy", clip': {
		'tokens': ['IDENT', 'OPERATOR', 'S', 'STRING', 'OPERATOR', 'S', 'IDENT'],
		'toString': 'ellipsis',
		'unparsed': ['OPERATOR', 'S', 'STRING', 'OPERATOR', 'S', 'IDENT'],
		'warnings': ['minimum_css_version_3']
	},
	'clip inherit': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'clip',
		'unparsed': ['IDENT'],
		'warnings': ['minimum_css_version_3']
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': 'inherit',
		'unparsed': [],
		'warnings': ['minimum_css_version_3']
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
