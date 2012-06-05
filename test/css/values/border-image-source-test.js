"use strict";
var util = require('./util');

exports.batch = util.makeVows('border-image-source', {
	'url(asdf.png)': {
		'tokens': ['URL'],
		'toString': 'url(asdf.png)',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'url(asdf.png) inherit': {
		'tokens': ['URL', 'S', 'IDENT'],
		'toString': 'url(asdf.png)',
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
