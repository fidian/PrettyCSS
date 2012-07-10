"use strict";

var cssBase = require('../base');
var util = require('../../util');
var valueBucket = require('../valuebucket');


var canStartWith = function (token, tokens, bucket) {
	// Needs to match property + S* + COLON
	if (! bucket.property.canStartWith(token, tokens, bucket)) {
		return false;
	}

	var offset = 1;

	if (token.type == 'CHAR' && token.content == '*') {
		// Properties might be two tokens instead of one
		offset ++;
	}

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


var getParser = function (fromMe) {
	switch (typeof fromMe) {
		case 'function':  // eg. simpleWarningFunction('browser-only')
			return fromMe;

		case 'string':  // 'border-single'
			if (! valueBucket[fromMe]) {
				throw new Error('Invalid valueBucket property: ' + fromMe);
			}
			if (! valueBucket[fromMe].parse) {
				throw new Error('Parser not defined for valueBucket[' + fromMe + ']');
			}
			return valueBucket[fromMe].parse;

		default:
			throw new Error('Unhandled "getParser" scenario: ' + typeof fromMe);
	}
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


var remakeProperties = function (inObj) {
	var outObj = {};

	for (var name in inObj) {
		outObj[name] = getParser(inObj[name]);
	}

	return outObj;
};


var parser = function (Declaration, propertyMapping) {
	propertyMapping = remakeProperties(propertyMapping);
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

		// Remove the hack
		if (propertyName.substr(0, 1) == '*') {
			propertyName = propertyName.substr(1);
			bucket.parser.addWarning('hack:star', declaration.property.list[0]);
		} else if (propertyName.substr(0, 1) == '_') {
			propertyName = propertyName.substr(1);
			bucket.parser.addWarning('hack:underscore', declaration.property.list[0]);
		}

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
		var result = valueBucket['expression'].parse(declaration.value.getTokens(), valueBucket, declaration);

		if (! result) {
			// Value is not an expression - try the expected value
			result = propertyMapping[propertyName](declaration.value.getTokens(), valueBucket, declaration);
		}

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


var simpleWarningFunction = function (warning) {
	return function (actualParser, extra) {
		var realParser = getParser(actualParser);
		return function (unparsedReal, bucket, container) {
			var obj = realParser(unparsedReal, bucket, container);

			if (obj) {
				if ('undefined' != typeof extra) {
					obj.addWarning(warning + ':' + extra, bucket.propertyToken);
				} else {
					obj.addWarning(warning, bucket.propertyToken);
				}
			}

			return obj;
		};
	};
};


exports.base = {};

util.extend(exports.base, cssBase.base, {
	name: 'declaration-base',

	toString: function () {
		this.debug('toString');
		var out = this.property.toString();
		out += ":";
		out += this.value.toString();
		out += ";";
		return this.addWhitespace("declaration", out);
	}
});

exports.baseConstructor = cssBase.baseConstructor;
exports.browserOnly = simpleWarningFunction('browser-only');
exports.canStartWith = canStartWith;
exports.declarationParser = parser;
exports.deprecated = simpleWarningFunction('deprecated');
exports.wrongProperty = simpleWarningFunction('wrong-property');
