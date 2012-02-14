var assert = require('assert');
var fs = require('fs');
var diff = require('diff');
var tokenizer = require('../../lib/tokenizer');

exports.tokenizeFile = function (context) {
	context.topic = function () {
		var filename = this.context.name.split(' ')[0];
		filename = __dirname + "/fixtures/" + filename;
		tokenizer.tokenizeFile(filename, this.callback);
	};

	return context;
};

exports.fakeParser = function () {
	var parser = {
		options: {
			ruleset_pre: "",
			ruleset_post: "",
			declaration_pre: '',
			declaration_post: '',
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
			cdo: "<!-- ", // Either {w} or {w}CDO{w}
			cdc: " -->", // Either {w} or {w}CDC{w}
			topcomment_pre: "",
			topcomment_post: "",
			comment_pre: "",
			comment_post: ""
		}
	};
	return parser;
};

exports.compareResult = function compareTokens(against) {
	context = {
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

				var result = against.parse(tokenizerObj, exports.fakeParser(), {});
				topicCallback(err, expected, result, tokenizerObj);
			});
		},

		'Name': function (err, expected, result, tokenizerObj) {
			assert.ifError(err);
			assert.equal(result.name, expected.name);
		},

		'Token List': function (err, expected, result, tokenizerObj) {
			assert.ifError(err);
			var tokenList = [];

			for (var i in result.list) {
				var e = result.list[i];

				if (e.name) {
					tokenList.push(e.name)
				} else {
					tokenList.push(e.type);
				}
			}

			assert.deepEqual(tokenList, expected.tokenList);
		},

		'Tokens Remaining': function (err, expected, result, tokenizerObj) {
			assert.ifError(err);
			var remaining = tokenizerObj.tokens.length - tokenizerObj.tokenIndex;
			assert.equal(remaining, expected.tokensRemaining);
		},

		'ToString': function (err, expected, result, tokenizerObj) {
			assert.ifError(err);
			var str = result.toString();
			assert.equal(str, expected.toString);
		}
	};

	return context;
};

