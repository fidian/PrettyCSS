"use strict";
var util = require('./util');

exports.batch = util.makeVows('font-variant', {
	'inherit normal': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'inherit',
		'unparsed': ['IDENT'],
		'warnings': ['css-minimum:2']
	},
	'normal ruby': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'normal',
		'unparsed': ['IDENT'],
		'warnings': []
	},
	'ruby historical-forms inherit': {
		'tokens': ['IDENT', 'S', 'IDENT', 'S', 'IDENT'],
		'toString': 'ruby historical-forms',
		'unparsed': ['IDENT'],
		'warnings': ['css-minimum:3']
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
