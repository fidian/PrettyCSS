"use strict";

var cssBase = require('../base');
var util = require('../../util');
var valueBucket = require('../valuebucket');

exports.base = {};

util.extend(exports.base, cssBase.base, {
	name: 'declaration-base',

	toString: function () {
		this.debug('toString');
		var out = this.property.toString();
		out += ":";
		out += this.value.toString();
		out += ":";
		return this.addWhitespace("declaration", out);
	}
});

exports.baseConstructor = cssBase.baseConstructor;

exports.canStartWith = function (token, tokens, bucket) {
	// Needs to match property + S* + COLON
	if (! bucket.property.canStartWith(token, tokens, bucket)) {
		return false;
	}

	var offset = 1;
	var t = tokens.getToken(offset);

	if (t && t.type == 'S') {
		offset ++;
		t = tokens.getToken(offset);
	}

	if (t && t.type == 'COLON') {
		return true;
	}

	return false;
};

var isPartOfValue = function (token) {
	if (! token) {
		return false;
	}

	if (token.type == 'SEMICOLON' || token.type == 'BLOCK_CLOSE') {
		return false;
	}

	return true;
};

exports.declarationParser = function (Declaration, propertyMapping) {
	return function (tokens, bucket, container) {
		var declaration = new Declaration(bucket, container);
		declaration.debug('parse', tokens);

		declaration.property = bucket.property.parse(tokens, bucket, declaration);
		var nextToken = tokens.getToken();

		if (! nextToken || nextToken.type != "COLON") {
			bucket.parser.addError('colon-expected', nextToken);
			var invalidCss = bucket.invalid.parse(null, bucket, container);
			invalidCss.addList(declaration.property.list);
			invalidCss.consume(tokens);
			return invalidCss;
		}

		tokens.next();
		declaration.value = bucket.value.parse(tokens, bucket, declaration);

		// See if we can map properties to something we can validate
		var propertyName = declaration.property.getPropertyName().toLowerCase();

		if (! propertyMapping[propertyName]) {
			// Not a known property
			bucket.parser.addWarning('unknown-property:' + propertyName, declaration.property.list[0]);
			return declaration;
		}

		if (declaration.value.getLength() === 0) {
			bucket.parser.addWarning("require-value", declaration.property.list[0]);
			return declaration;
		}

		// Attempt to map the value
		valueBucket.setCssBucket(bucket);
		valueBucket.setDeclaration(declaration);
		var valueParser = propertyMapping[propertyName];
		var result = valueParser(declaration.value.getTokens(), valueBucket, declaration);

		if (! result) {
			// Value did not match expected patterns
			var tokenForError = declaration.value.firstToken();

			if (! tokenForError) {
				tokenForError = declaration.property.list[0];
			}

			bucket.parser.addWarning("invalid-value", tokenForError);
			return declaration;
		}

		result.doWarnings();

		if (result.unparsed.length()) {
			bucket.parser.addWarning("extra-tokens-after-value", result.unparsed.firstToken());
		}

		declaration.value.setTokens([ result, result.unparsed ]);
		return declaration;
	};
};
