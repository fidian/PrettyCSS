"use strict";
var vows = require('vows');
var util = require('./util');

util.name = 'background-color';
util.obj = require('../../../lib/css/values/' + util.name);

exports.batch = vows.describe('lib/css/' + util.name + '.js').addBatch({

	'#fff': util.testValue({
		'tokens': ['HASH'],
		'toString': '#fff',
		'unparsed': [],
		'warnings': []
	}),
	'#fff ajsdjlksdj': util.testValue({
		'tokens': ['HASH', 'S', 'IDENT'],
		'toString': '#fff',
		'unparsed': ['IDENT'],
		'warnings': []
	}),
	'inherit': util.testValue({
		'tokens': ['IDENT'],	
		'toString': 'inherit',
		'unparsed': [],
		'warnings': ['minimum_css_version_2', 'browser_unsupported_IE7', 'browser_quirk_IE8']
	}),
	'initial': util.testValue({
		'tokens': ['IDENT'],		
		'toString': 'initial',  	
		'unparsed': [],
		'warnings': ['minimum_css_version_3']
	}),		          	
	'klasdfkljsd': util.testValue({
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': []
	})
});
