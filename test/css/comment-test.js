"use strict";
var vows = require('vows');
var comment = require('../../lib/css/comment');
var util = require('./util');

vows.describe('lib/css/comment.js').addBatch({
	'comment.css': util.tokenizeFile({
		'comment.json': util.compareResult(comment)
	})
}).export(module);
