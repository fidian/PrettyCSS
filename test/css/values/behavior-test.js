"use strict";
var util = require('./util');

exports.batch = util.makeVows('behavior', {
	'url(asdf)': {
		'tokens': ['URL'],
		'toString': 'url(asdf)',
		'unparsed': [],
		'warnings': ['browser-only:ie']
	},
	'url(asdf) url(me)': {
		'tokens': ['URL', 'S', 'URL'],
		'toString': 'url(asdf)',
		'unparsed': ['URL'],
		'warnings': ['browser-only:ie']
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
