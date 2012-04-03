"use strict";

var base = require('./base');
var util = require('../util');

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
	'border-color': require('./values/border-color'),
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
	'border-spacing': require('./values/border-spacing'),
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
	'box-shadow': require('./values/box-shadow'),
	'-moz-box-shadow': require('./values/box-shadow'),
	'-webkit-box-shadow': require('./values/box-shadow'),
	'clear': require('./values/clear'),
	'color': require('./values/color'),
	'content': require('./values/content'),
	'cursor': require('./values/cursor'),
	'display': require('./values/display'),
	'filter': require('./values/filter'),
	'float': require('./values/float'),
	'font': require('./values/font'),
	'font-family': require('./values/font-family'),
	'font-size': require('./values/font-size'),
	'font-style': require('./values/font-style'),
	'font-weight': require('./values/font-weight'),
	'height': require('./values/height'),
	'left': require('./values/offset'),
	'line-height': require('./values/line-height'),
	'list-style': require('./values/list-style'),
	'list-style-image': require('./values/list-style-image'),
	'list-style-position': require('./values/list-style-position'),
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
	'text-indent': require('./values/text-indent'),
	'text-overflow': require('./values/text-overflow'),
	'text-shadow': require('./values/text-shadow'),
	'-o-text-overflow': require('./values/text-overflow'),
	'text-transform': require('./values/text-transform'),
	'top': require('./values/offset'),
	'vertical-align': require('./values/vertical-align'),
	'visibility': require('./values/visibility'),
	'white-space': require('./values/white-space'),
	'width': require('./values/width'),
	'z-index': require('./values/z-index'),
	'zoom': require('./values/zoom')
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
	var valueType = propertyMapping[propertyName];
	var result = valueType.parse(declaration.value.getTokens(), bucket.parser, declaration);

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
