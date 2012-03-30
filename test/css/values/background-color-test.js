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
	'klasdfkljsd': util.testValue({
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': []
	})
});
