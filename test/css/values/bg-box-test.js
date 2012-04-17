"use strict";
var util = require('./util');

exports.batch = util.makeVows('bg-box', {
	'padding-box': {
		'tokens': ['IDENT'],
		'toString': 'padding-box',
		'unparsed': [],
		'warnings': ['css-minimum:3', 'css-draft']
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
