var vows = require('vows');
var assert = require('assert');
var tokenizer = require('../lib/tokenizer')
var fs = require('fs');
var diff = require('diff');

var tokenizeFile = function (context) {
	context.topic = function () {
		var filename = this.context.name.split(' ')[0];
		filename = __dirname + "/css/" + filename;
		tokenizer.tokenizeFile(filename, this.callback);
	};

	return context;
};

var tokensToString = function (tokens) {
	var out = [];

	for (var i = 0; i < tokens.length; i ++) {
		out.push(JSON.stringify(tokens[i]));
	}

	out = "[\n\t" + out.join(",\n\t") + "\n]";
	return out;
};

var compareTokens = function compareTokens() {
	context = {
		topic: function (tokenizerObj) {
			var topicCallback = this.callback;
			var filename = this.context.name.split(' ')[0];
			filename = __dirname + "/css/" + filename;
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

				topicCallback(err, tokensExpected, tokenizerObj);
			});
		},

		'Tokens Match': function (err, expected, tokenizerObj) {
			var actual = tokenizerObj.tokens;
			var eStr = tokensToString(expected) + "\n";
			var aStr = tokensToString(actual) + "\n";
			var dStr = diff.createPatch(null, aStr, eStr);
			assert.deepEqual(expected, actual, "Token list did not match\nExpected: " + eStr + "Actual: " + aStr + "Diff:" + dStr);
		}
	};

	return context;
};

vows.describe('lib/tokenizer.js').addBatch({
	'simple.css': tokenizeFile({
		'simple.json': compareTokens(),
		'whatever': function (result) {
			//console.log('TOKENIZER RESULT');
			//console.log(result);
		}
	})
}).export(module);
