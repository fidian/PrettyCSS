"use strict";
var vows = require('vows');
var assert = require('assert');
var tokenizer = require('../lib/tokenizer');
var fs = require('fs');
var diff = require('diff');

var tokenizeFile = function (context) {
	context.topic = function () {
		var filename = this.context.name.split(' ')[0];
		filename = __dirname + "/tokenizer/" + filename;
		tokenizer.tokenizeFile(filename, this.callback);
	};

	return context;
};

var compareTokens = function compareTokens() {
	var context = {
		topic: function (tokenizerObj) {
			var topicCallback = this.callback;
			var filename = this.context.name.split(' ')[0];
			filename = __dirname + "/tokenizer/" + filename;
			fs.readFile(filename, 'utf-8', function (err, data) {
				if (err) {
					topicCallback(err);
					return;
				}

				try {
					var tokensExpected = JSON.parse(data);
				} catch (err) {
					topicCallback(err);
					return;
				}

				topicCallback(err, tokensExpected, data, tokenizerObj);
			});
		},

		'Tokens Match': function (err, expected, expectedString, tokenizerObj) {
			assert.ifError(err);
			var actual = tokenizerObj.tokens;
			var aStr = tokenizerObj.toString() + "\n";
			var dStr = diff.createPatch(null, aStr, expectedString);
			assert.deepEqual(actual, expected, "Token list did not match\nDiff:" + dStr);
		}
	};

	return context;
};

exports.batch = vows.describe('lib/tokenizer.js').addBatch({
	'comments.css': tokenizeFile({
		'comments.json': compareTokens()
	}),
	'meyers_reset.css': tokenizeFile({
		'meyers_reset.json': compareTokens()
	}),
	'simple.css': tokenizeFile({
		'simple.json': compareTokens()
	})
});
