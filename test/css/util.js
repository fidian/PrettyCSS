"use strict";
var assert = require('assert');
var fs = require('fs');
var diff = require('diff');
var tokenizer = require('../../lib/tokenizer');
var cssBucket = require('../../lib/cssbucket');

exports.tokenizeFile = function (context) {
	context.topic = function () {
		var filename = this.context.name.split(' ')[0];
		filename = __dirname + "/fixtures/" + filename;
		tokenizer.tokenizeFile(filename, this.callback);
	};

	return context;
};

exports.fakeBucket = function () {
	var fakeBucket = {
		tokenizer: tokenizer,
		parser: {
			addError: function (code, token) {
				if (token) {
					this.errors.push(code + ":" + token.type + "@" + token.line);
				} else {
					this.errors.push(code + ":no_token");
				}
			},

			addWarning: function () {
				// Do not care for these unit tests
			},

			errors: [],

			options: {
				debug: false,
				autocorrect: true,
				ruleset_pre: "",
				ruleset_post: "",
				combinator_pre: "",
				combinator_post: "",
				declaration_pre: '',
				declaration_post: '',
				stylesheet_pre: "",
				stylesheet_whitespace: "",
				stylesheet_post: "",
				selector_pre: "",
				selector_post: "",
				selector_whitespace: " ", // Must contain whitespace
				selector_comma: ",", // Must contain comma
				block_pre: "{",  // Must contain {
				block_post: "}",  // Must contain }
				indent: "",
				property_pre: "",
				property_post: "",
				value_pre: "",
				value_post: "",
				at_pre: "",
				at_post: "",
				atblock_pre: "{",
				atblock_post: "}",
				at_whitespace: " ",
				important: " !important", // Must contain !{w}important
				cdo: "<!--", // Either {w} or {w}CDO{w}
				cdc: "-->", // Either {w} or {w}CDC{w}
				topcomment_pre: "",
				topcomment_post: "",
				comment_pre: "",
				comment_post: ""
			}
		}
	};
	fakeBucket.options = fakeBucket.parser.options;

	for (var i in cssBucket) {
		fakeBucket[i] = cssBucket[i];
	}

	return fakeBucket;
};

exports.compareResult = function compareTokens(against) {
	var context = {
		topic: function (tokenizerObj) {
			var topicCallback = this.callback;
			var filename = this.context.name.split(' ')[0];
			filename = __dirname + "/fixtures/" + filename;
			fs.readFile(filename, 'utf-8', function (err, data) {
				if (err) {
					topicCallback(err);
					return;
				}

				try {
					var expected = JSON.parse(data);
				} catch (err) {
					topicCallback(err);
					return;
				}

				var fakeBucket = exports.fakeBucket();
				var result = against.parse(tokenizerObj, fakeBucket, {});
				topicCallback(err, expected, result, tokenizerObj, fakeBucket);
			});
		},

		'Errors': function (err, expected, result, tokenizerObj, fakeBucket) {
			assert.ifError(err);
			assert.deepEqual(fakeBucket.parser.errors, expected.errors);
		},

		'Name': function (err, expected, result, tokenizerObj, fakeBucket) {
			assert.ifError(err);
			assert.equal(result.name, expected.name);
		},

		'Token List': function (err, expected, result, tokenizerObj, fakeBucket) {
			assert.ifError(err);
			var tokenList = [];

			for (var i in result.list) {
				var e = result.list[i];

				if (e.name) {
					tokenList.push(e.name);
				} else {
					tokenList.push(e.type);
				}
			}

			assert.deepEqual(tokenList, expected.tokenList);
		},

		'Tokens Remaining': function (err, expected, result, tokenizerObj, fakeBucket) {
			assert.ifError(err);
			var remaining = tokenizerObj.tokens.length - tokenizerObj.tokenIndex;
			var tokensLeft = [];

			while (tokenizerObj.anyLeft()) {
				tokensLeft.push(tokenizerObj.getToken().type);
				tokenizerObj.next();
			}

			assert.equal(remaining, expected.tokensRemaining, "Expected " + expected.tokensRemaining + ", actually was " + remaining + ".\nWe have: " + tokensLeft.join(" "));
		},

		'ToString': function (err, expected, result, tokenizerObj, fakeBucket) {
			assert.ifError(err);
			var str = result.toString();
			assert.equal(str, expected.toString);
		}
	};

	return context;
};

