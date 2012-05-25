"use strict";
var util = require('./util');

exports.batch = util.makeVows('image', {
	'url(image.png)': {
		'tokens': ['URL'],
		'toString': 'url(image.png)',
		'unparsed': [],
		'warnings': []
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
