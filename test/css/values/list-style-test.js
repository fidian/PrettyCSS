"use strict";
var util = require('./util');

exports.batch = util.makeVows('list-style', {
	'url(images/test-image.png)': {
		'tokens': ['URL'],
		'toString': 'url(images/test-image.png)',
		'unparsed': [],
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
