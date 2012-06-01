"use strict";
var util = require('./util');

exports.batch = util.makeVows('font-face-src-single', {
	'url(asdf.ttf)': {
		'tokens': ['URL'],
		'toString': 'url(asdf.ttf)',
		'unparsed': [],
		'warnings': []
	},
	'url(asdf.ttf) ttf': {
		'tokens': ['URL', 'S', 'IDENT'],
		'toString': 'url(asdf.ttf)',
		'unparsed': ['IDENT'],
		'warnings': []
	},
	'all': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
