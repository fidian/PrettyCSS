"use strict";
var util = require('./util');

exports.batch = util.makeVows('box-shadow-single', {
	'8px 8px' : {
		'tokens': ['UNIT','S', 'UNIT'],
		'toString': '8px 8px',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': 'inherit',
		'unparsed': [],
		'warnings': ['css-minimum:3', 'css-minimum:2' ]
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
