"use strict";

var base = require('./base');
var invalid = require('./invalid');
var property = require('./property');
var util = require('../util');
var value = require('./value');

// Mapping properties to value types
var propertyMapping = {
	'background': require('./values/background'),
	'background-attachment': require('./values/background-attachment'),
	'background-clip': require('./values/background-clip'),
	'-khtml-background-clip': require('./values/background-clip-deprecated'),
	'-moz-background-clip': require('./values/background-clip-deprecated'),
	'-webkit-background-clip': require('./values/background-clip-deprecated'),
	'background-color': require('./values/background-color'),
	'background-image': require('./values/background-image'),
	'background-origin': require('./values/background-origin'),
	'background-position': require('./values/background-position'),
	'background-repeat': require('./values/background-repeat'),
	'background-size': require('./values/background-size'),
	'border': require('./values/border-single'),
	'border-bottom': require('./values/border-single'),
	'border-bottom-left-radius': require('./values/border-radius-single'),
	'-khtml-border-bottom-left-radius': require('./values/border-radius-single-deprecated'),
	'-moz-border-radius-bottomleft': require('./values/border-radius-single-deprecated'),
	'-webkit-border-bottom-left-radius': require('./values/border-radius-single-deprecated'),
	'border-bottom-right-radius': require('./values/border-radius-single'),
	'-khtml-border-bottom-right-radius': require('./values/border-radius-single-deprecated'),
	'-moz-border-radius-bottomright': require('./values/border-radius-single-deprecated'),
	'-webkit-border-bottom-right-radius': require('./values/border-radius-single-deprecated'),
	'border-bottom-style': require('./values/border-style'),
	'border-bottom-width': require('./values/border-width-single'),
	'border-collapse': require('./values/border-collapse'),
	'border-left': require('./values/border-single'),
	'border-left-style': require('./values/border-style'),
	'border-left-width': require('./values/border-width-single'),
	'border-radius': require('./values/border-radius'),
	'-khtml-border-radius': require('./values/border-radius-deprecated'),
	'-moz-border-radius': require('./values/border-radius-deprecated'),
	'-webkit-border-radius': require('./values/border-radius-deprecated'),
	'border-right': require('./values/border-single'),
	'border-right-style': require('./values/border-style'),
	'border-right-width': require('./values/border-width-single'),
	'border-style': require('./values/border-style'),
	'border-top': require('./values/border-single'),
	'border-top-left-radius': require('./values/border-radius-single'),
	'-khtml-border-top-left-radius': require('./values/border-radius-single-deprecated'),
	'-moz-border-radius-topleft': require('./values/border-radius-single-deprecated'),
	'-webkit-border-top-left-radius': require('./values/border-radius-single-deprecated'),
	'border-top-right-radius': require('./values/border-radius-single'),
	'-khtml-border-top-right-radius': require('./values/border-radius-single-deprecated'),
	'-moz-border-radius-topright': require('./values/border-radius-single-deprecated'),
	'-webkit-border-top-right-radius': require('./values/border-radius-single-deprecated'),
	'border-top-style': require('./values/border-style'),
	'border-top-width': require('./values/border-width-single'),
	'border-width': require('./values/border-width'),
	'bottom': require('./values/offset'),
	'clear': require('./values/clear'),
	'color': require('./values/color'),
	'cursor': require('./values/cursor'),
	'display': require('./values/display'),
	'float': require('./values/float'),
	'font-family': require('./values/font-family'),
	'font-size': require('./values/font-size'),
	'font-weight': require('./values/font-weight'),
	'height': require('./values/height'),
	'left': require('./values/offset'),
	'line-height': require('./values/line-height'),
	'list-style-type': require('./values/list-style-type'),
	'margin': require('./values/margin'),
	'margin-bottom': require('./values/margin-width'),
	'margin-left': require('./values/margin-width'),
	'margin-right': require('./values/margin-width'),
	'margin-top': require('./values/margin-width'),
	'max-height': require('./values/max-length'),
	'max-width': require('./values/max-length'),
	'min-height': require('./values/min-length'),
	'min-width': require('./values/min-length'),
	'opacity': require('./values/opacity'),
	'outline': require('./values/outline'),
	'outline-color': require('./values/outline-color'),
	'outline-style': require('./values/outline-style'),
	'outline-width': require('./values/min-length'),
	'overflow': require('./values/overflow'),
	'overflow-x': require('./values/overflow-dimension'),
	'overflow-y': require('./values/overflow-dimension'),
	'padding': require('./values/padding'),
	'padding-bottom': require('./values/padding-width'),
	'padding-left': require('./values/padding-width'),
	'padding-right': require('./values/padding-width'),
	'padding-top': require('./values/padding-width'),
	'position': require('./values/position'),
	'right': require('./values/offset'),
	'text-align': require('./values/text-align'),
	'text-decoration': require('./values/text-decoration'),
	'text-decoration-color': require('./values/text-decoration-color'),
	'text-decoration-line': require('./values/text-decoration-line'),
	'text-decoration-style': require('./values/text-decoration-style'),
	'text-transform': require('./values/text-transform'),
	'top': require('./values/offset'),
	'vertical-align': require('./values/vertical-align'),
	'width': require('./values/width'),
	'z-index': require('./values/z-index')
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

exports.canStartWith = function (token, tokens) {
	// Needs to match property + S* + COLON
	if (! property.canStartWith(token, tokens)) {
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

exports.parse = function (tokens, parser, container) {
	var declaration = new Declaration(parser, container);
	declaration.debug('parse', tokens);

	declaration.property = property.parse(tokens, parser, declaration);
	var nextToken = tokens.getToken();

	if (! nextToken || nextToken.type != "COLON") {
		parser.addError('colon_expected', nextToken);
		var invalidCss = invalid.parse(null, parser, container);
		invalidCss.addList(declaration.property.list);
		invalidCss.consume(tokens);
		return invalidCss;
	}

	tokens.next();
	declaration.value = value.parse(tokens, parser, declaration);

	// See if we can map properties to something we can validate
	var propertyName = declaration.property.getPropertyName().toLowerCase();

	if (! propertyMapping[propertyName]) {
		// Not a known property
		parser.addWarning('unknown_property', declaration.property.list[0]);
		return declaration;
	}

	if (declaration.value.getLength() === 0) {
		parser.addWarning("no_value_for_property", declaration.property.list[0]);
		return declaration;
	}

	// Attempt to map the value
	var valueType = propertyMapping[propertyName];
	var result = valueType.parse(declaration.value.getTokens(), parser, declaration);

	if (! result) {
		// Value did not match expected patterns
		parser.addWarning("invalid_value", declaration.value.firstToken());
		return declaration;
	}

	result.doWarnings();
	result.unparsed.skipWhitespace();

	if (result.unparsed.length()) {
		parser.addWarning("extra_tokens_after_value", result.unparsed.firstToken());
	}

	declaration.value.setTokens([ result, result.unparsed ]);
	return declaration;
};
