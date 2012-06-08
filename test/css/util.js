"use strict";
var assert = require('assert');
var cssBucket = require('../../lib/cssbucket');
var diff = require('diff');
var fs = require('fs');
var tokenizer = require('../../lib/tokenizer');
var vows = require('vows');

var fakeBucket = function () {
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
				keyframe_pre: '',
				keyframe_post: '',
				keyframeselector_pre: '',
				keyframeselector_post: '',
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
		if (typeof fakeBucket[i] == 'undefined') {
			fakeBucket[i] = cssBucket[i];
		}
	}

	return fakeBucket;
};

exports.makeVows = function (name, batches) {
	var obj = require('../../lib/css/' + name);
	var batchRework = {};

	for (var i in batches) {
		batchRework[name + '-test.js: ' + i] = testValue(name, obj, batches[i]);
	}

	return vows.describe('lib/css/' + name + '.js').addBatch(batchRework);
};

var testValue = function (name, obj, expected) {
	if (typeof expected.name == 'undefined') {
		expected.name = name;
	}

	if (typeof expected.errors == 'undefined') {
		expected.errors = [];
	}

	var context = {
		topic: function () {
			var actualTokens = tokenizer.tokenize(expected.input);
			var bucket = fakeBucket();
			var parseResult = obj.parse(actualTokens, bucket, {});

			var topic = {
				tokenizer: actualTokens,
				bucket: bucket,
				result: parseResult
			};

			return topic;
		},

		'No Exceptions': function (topic) {
			if (topic instanceof Error) {
				throw topic;
			}
		},

		'Errors': function (topic) {
			assert.deepEqual(topic.bucket.parser.errors, expected.errors);
		},

		'Name': function (topic) {
			assert.equal(topic.result.name, expected.name);
		},

		'Token List': function (topic) {
			var tokenList = [];

			for (var i in topic.result.list) {
				var e = topic.result.list[i];

				if (e.name) {
					tokenList.push(e.name);
				} else {
					tokenList.push(e.type);
				}
			}

			assert.deepEqual(tokenList, expected.tokenList);
		},

		'Tokens Remaining': function (topic) {
			var remaining = topic.tokenizer.tokens.length - topic.tokenizer.tokenIndex;
			var tokensLeft = [];

			while (topic.tokenizer.anyLeft()) {
				tokensLeft.push(topic.tokenizer.getToken().type);
				topic.tokenizer.next();
			}

			assert.equal(remaining, expected.tokensRemaining, "Expected " + expected.tokensRemaining + ", actually was " + remaining + ".\nWe have: " + tokensLeft.join(" "));
		},

		'ToString': function (topic) {
			var str = null;

			if (topic.result) {
				str = topic.result.toString();
			}

			assert.equal(str, expected.toString);
		}
	};

	return context;
};
