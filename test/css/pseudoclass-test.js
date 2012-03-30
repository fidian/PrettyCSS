"use strict";
var vows = require('vows');
var pseudo = require('../../lib/css/pseudoclass');
var util = require('./util');

exports.batch = vows.describe('lib/css/pseudoclass.js').addBatch({
	'pseudoclass.css': util.tokenizeFile({
		'pseudoclass.json': util.compareResult(pseudo)
	})
});
