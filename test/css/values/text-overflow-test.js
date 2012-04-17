"use strict";
var util = require('./util');

exports.batch = util.makeVows('text-overflow', {
	'clip': {
		'tokens': ['IDENT'],
		'toString': 'clip',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'ellipsis "wonderboy" clip': {
		'tokens': ['IDENT', 'S', 'STRING', 'S', 'IDENT'],
		'toString': 'ellipsis "wonderboy"',
		'unparsed': ['IDENT'],
		'warnings': ['css-minimum:3']
	},
	'ellipsis, "wonderboy", clip': {
		'tokens': ['IDENT', 'OPERATOR', 'S', 'STRING', 'OPERATOR', 'S', 'IDENT'],
		'toString': 'ellipsis',
		'unparsed': ['OPERATOR', 'S', 'STRING', 'OPERATOR', 'S', 'IDENT'],
		'warnings': ['css-minimum:3']
	},
	'clip inherit': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'clip',
		'unparsed': ['IDENT'],
		'warnings': ['css-minimum:3']
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': 'inherit',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
