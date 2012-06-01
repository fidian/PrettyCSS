"use strict";
var util = require('./util');

exports.batch = util.makeVows('font-face-font-size', {
	'all': {
		'tokens': ['IDENT'],
		'toString': 'all',
		'unparsed': [],
		'warnings': ['css-minimum:2', 'css-maximum:2', 'not-forward-compatible:3']
	},
	'12px': {
		'tokens': ['UNIT'],
		'toString': '12px',
		'unparsed': [],
		'warnings': ['not-forward-compatible:3', 'css-minimum:2', 'css-maximum:2']
	},
	'77em, 12px 72pt': {
		'tokens': ['UNIT', 'OPERATOR', 'S', 'UNIT', 'S', 'UNIT'],
		'toString': '77em, 12px',
		'unparsed': ['UNIT'],
		'warnings': ['not-forward-compatible:3', 'css-minimum:2', 'css-maximum:2']
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
