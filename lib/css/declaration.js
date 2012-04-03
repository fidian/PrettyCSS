"use strict";

var base = require('./base');
var util = require('../util');
var valueBucket = require('./valuebucket');

// Mapping properties to value types
var propertyMapping = {
	'background': 'background',
	'background-attachment': 'background-attachment',
	'background-clip': 'background-clip',
	'-khtml-background-clip': 'background-clip-deprecated',
	'-moz-background-clip': 'background-clip-deprecated',
	'-webkit-background-clip': 'background-clip-deprecated',
	'background-color': 'background-color',
	'background-image': 'background-image',
	'background-origin': 'background-origin',
	'background-position': 'background-position',
	'background-repeat': 'background-repeat',
	'background-size': 'background-size',
	'border': 'border-single',
	'border-bottom': 'border-single',
	'border-bottom-left-radius': 'border-radius-single',
	'-khtml-border-bottom-left-radius': 'border-radius-single-deprecated',
	'-moz-border-radius-bottomleft': 'border-radius-single-deprecated',
	'-webkit-border-bottom-left-radius': 'border-radius-single-deprecated',
	'border-bottom-right-radius': 'border-radius-single',
	'-khtml-border-bottom-right-radius': 'border-radius-single-deprecated',
	'-moz-border-radius-bottomright': 'border-radius-single-deprecated',
	'-webkit-border-bottom-right-radius': 'border-radius-single-deprecated',
	'border-bottom-style': 'border-style',
	'border-bottom-width': 'border-width-single',
	'border-collapse': 'border-collapse',
	'border-color': 'border-color',
	'border-left': 'border-single',
	'border-left-style': 'border-style',
	'border-left-width': 'border-width-single',
	'border-radius': 'border-radius',
	'-khtml-border-radius': 'border-radius-deprecated',
	'-moz-border-radius': 'border-radius-deprecated',
	'-webkit-border-radius': 'border-radius-deprecated',
	'border-right': 'border-single',
	'border-right-style': 'border-style',
	'border-right-width': 'border-width-single',
	'border-spacing': 'border-spacing',
	'border-style': 'border-style',
	'border-top': 'border-single',
	'border-top-left-radius': 'border-radius-single',
	'-khtml-border-top-left-radius': 'border-radius-single-deprecated',
	'-moz-border-radius-topleft': 'border-radius-single-deprecated',
	'-webkit-border-top-left-radius': 'border-radius-single-deprecated',
	'border-top-right-radius': 'border-radius-single',
	'-khtml-border-top-right-radius': 'border-radius-single-deprecated',
	'-moz-border-radius-topright': 'border-radius-single-deprecated',
	'-webkit-border-top-right-radius': 'border-radius-single-deprecated',
	'border-top-style': 'border-style',
	'border-top-width': 'border-width-single',
	'border-width': 'border-width',
	'bottom': 'offset',
	'box-shadow': 'box-shadow',
	'-moz-box-shadow': 'box-shadow',
	'-webkit-box-shadow': 'box-shadow',
	'clear': 'clear',
	'color': 'color',
	'content': 'content',
	'cursor': 'cursor',
	'display': 'display',
	'filter': 'filter',
	'float': 'float',
	'font': 'font',
	'font-family': 'font-family',
	'font-size': 'font-size',
	'font-style': 'font-style',
	'font-weight': 'font-weight',
	'height': 'height',
	'left': 'offset',
	'line-height': 'line-height',
	'list-style': 'list-style',
	'list-style-image': 'list-style-image',
	'list-style-position': 'list-style-position',
	'list-style-type': 'list-style-type',
	'margin': 'margin',
	'margin-bottom': 'margin-width',
	'margin-left': 'margin-width',
	'margin-right': 'margin-width',
	'margin-top': 'margin-width',
	'max-height': 'max-length',
	'max-width': 'max-length',
	'min-height': 'min-length',
	'min-width': 'min-length',
	'opacity': 'opacity',
	'outline': 'outline',
	'outline-color': 'outline-color',
	'outline-style': 'outline-style',
	'outline-width': 'min-length',
	'overflow': 'overflow',
	'overflow-x': 'overflow-dimension',
	'overflow-y': 'overflow-dimension',
	'padding': 'padding',
	'padding-bottom': 'padding-width',
	'padding-left': 'padding-width',
	'padding-right': 'padding-width',
	'padding-top': 'padding-width',
	'position': 'position',
	'right': 'offset',
	'text-align': 'text-align',
	'text-decoration': 'text-decoration',
	'text-decoration-color': 'text-decoration-color',
	'text-decoration-line': 'text-decoration-line',
	'text-decoration-style': 'text-decoration-style',
	'text-indent': 'text-indent',
	'text-overflow': 'text-overflow',
	'text-shadow': 'text-shadow',
	'-o-text-overflow': 'text-overflow',
	'text-transform': 'text-transform',
	'top': 'offset',
	'vertical-align': 'vertical-align',
	'visibility': 'visibility',
	'white-space': 'white-space',
	'width': 'width',
	'z-index': 'z-index',
	'zoom': 'zoom'
};

var Declaration = base.baseConstructor();

util.extend(Declaration.prototype, base.base, {
	name: "declaration",

	toString: function () {
		this.debug('toString');
		var out = this.property.toString();
		out += ":";
		out += this.value.toString();
		out += ";";
		return this.addWhitespace('declaration', out);
	}
});

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

exports.parse = function (tokens, bucket, container) {
	var declaration = new Declaration(bucket, container);
	declaration.debug('parse', tokens);

	declaration.property = bucket.property.parse(tokens, bucket, declaration);
	var nextToken = tokens.getToken();

	if (! nextToken || nextToken.type != "COLON") {
		bucket.parser.addError('colon_expected', nextToken);
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
		bucket.parser.addWarning('unknown_property', declaration.property.list[0]);
		return declaration;
	}

	if (declaration.value.getLength() === 0) {
		bucket.parser.addWarning("no_value_for_property", declaration.property.list[0]);
		return declaration;
	}

	// Attempt to map the value
	var valueTypeString = propertyMapping[propertyName];
	valueBucket.setCssBucket(bucket);
	var valueType = valueBucket[valueTypeString];
	var result = valueType.parse(declaration.value.getTokens(), valueBucket, declaration);

	if (! result) {
		// Value did not match expected patterns
		var tokenForError = declaration.value.firstToken();

		if (! tokenForError) {
			tokenForError = declaration.property.list[0];
		}

		bucket.parser.addWarning("invalid_value", tokenForError);
		return declaration;
	}

	result.doWarnings();
	result.unparsed.skipWhitespace();

	if (result.unparsed.length()) {
		bucket.parser.addWarning("extra_tokens_after_value", result.unparsed.firstToken());
	}

	declaration.value.setTokens([ result, result.unparsed ]);
	return declaration;
};
