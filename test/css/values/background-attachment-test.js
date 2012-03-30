"use strict";
var vows = require('vows');
var util = require('./util');

util.name = 'background-attachment';
util.obj = require('../../../lib/css/values/' + util.name);

exports.batch = vows.describe('lib/css/' + util.name + '.js').addBatch({
	// <bg-attachment>#
	'scroll ': util.testValue({
		'tokens': [ 'IDENT', 'S' ],
		'toString': 'scroll',
		'unparsed': [],
		'warnings': []
	}),
	'scroll , fixed , keyboard': util.testValue({
		'tokens': [ 'IDENT', 'S', 'OPERATOR', 'S', 'IDENT', 'S', 'OPERATOR', 'S', 'IDENT' ],
		'toString': 'scroll, fixed',
		'unparsed': ['OPERATOR', 'S', 'IDENT'],
		'warnings': [ 'minimum_css_version_3' ]
	}),
	'scroll,fixed,scroll,fixed': util.testValue({
		'tokens': [ 'IDENT', 'OPERATOR', 'IDENT', 'OPERATOR', 'IDENT', 'OPERATOR', 'IDENT' ],
		'toString': 'scroll, fixed, scroll, fixed',
		'unparsed': [],
		'warnings': [ 'minimum_css_version_3' ]
	}),
	'moose': util.testValue({
		'tokens': [ 'IDENT' ],
		'toString': null,
		'unparsed': [ 'IDENT' ],
		'warnings': null
	})
});
