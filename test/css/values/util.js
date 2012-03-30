"use strict";
var assert = require('assert');
var tokenizer = require('../../../lib/tokenizer');
var unparsed = require('../../../lib/css/values/unparsed');

exports.obj = null;  // Must set this
exports.name = '';  // Must set this

var tokensToStringArray = function (list) {
	var out = [];

	list.forEach(function (item) {
		out.push(item.type);
	});

	return out;
};

var warningsToStringArray = function (list) {
	var out = [];

	list.forEach(function (item) {
		out.push(item[0]);
	});

	return out;
};

exports.testValue = function (expected) {
	expected.name = exports.name;

	if (expected.toString === null) {
		expected.warnings = null;
		expected.name = null;
	}

	var context = {
		topic: function () {
			var valueString = this.context.name;
			var actualTokens = tokenizer.tokenize(valueString);


			var container = {};
			var parser = {
				debug: function () {},
				options: {
					debug: false
				}
			};
			var unparsedReal = new unparsed.constructor(actualTokens.tokens, parser, container);
			var parseResult = exports.obj.parse(unparsedReal, parser, container);
			var actual = {
				tokens: tokensToStringArray(actualTokens.tokens)
			};

			if (parseResult) {
				actual.name = parseResult.name;
				actual.toString = parseResult.toString();
				actual.unparsed = tokensToStringArray(parseResult.unparsed.list);
				actual.warnings = warningsToStringArray(parseResult.warningList);
			} else {
				actual.name = null;
				actual.toString = null;
				actual.unparsed = actual.tokens;
				actual.warnings = null;
			}

			return actual;
		},

		'Name': function (actual) {
			assert.equal(actual.name, expected.name);
		},

		'ToString': function (actual) {
			assert.equal(actual.toString, expected.toString);
		},

		'Tokens': function (actual) {
			assert.deepEqual(actual.tokens, expected.tokens);
		},

		'Unparsed': function (actual) {
			assert.deepEqual(actual.unparsed, expected.unparsed);
		},

		'Warnings': function (actual) {
			assert.deepEqual(actual.warnings, expected.warnings);
		}
	};

	return context;
};

