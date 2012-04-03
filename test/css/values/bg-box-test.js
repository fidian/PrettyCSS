"use strict";
var util = require('./util');

exports.batch = util.makeVows('bg-box', {
	'pading-box': {
		'tokens': ['IDENT'],
		'toString': 'padding-box',
		'unparsed': [],
		'warnings': ['minimum_css_version_3', 'working_draft']
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
