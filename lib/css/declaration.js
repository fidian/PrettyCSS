"use strict";

var base = require('./base');
var util = require('../util');
var valueBucket = require('./valuebucket');
var valueWrapper = require('./valuewrapper');

// Mapping properties to value types
var propertyMapping = {
	'background': valueBucket['background'].parse,
	'background-attachment': valueBucket['background-attachment'].parse,
	'background-clip': valueBucket['background-clip'].parse,
	'-khtml-background-clip': valueWrapper.deprecated(valueBucket['background-clip'].parse, 'background-clip'),
	'-moz-background-clip': valueWrapper.deprecated(valueBucket['background-clip'].parse, 'background-clip'),
	'-webkit-background-clip': valueWrapper.deprecated(valueBucket['background-clip'].parse),
	'background-color': valueBucket['background-color'].parse,
	'background-image': valueBucket['background-image'].parse,
	'background-origin': valueBucket['background-origin'].parse,
	'background-position': valueBucket['background-position'].parse,
	'background-repeat': valueBucket['background-repeat'].parse,
	'background-size': valueBucket['background-size'].parse,
	'border': valueBucket['border-single'].parse,
	'border-bottom': valueBucket['border-single'].parse,
	'border-bottom-left-radius': valueBucket['border-radius-single'].parse,
	'-khtml-border-bottom-left-radius': valueWrapper.deprecated(valueBucket['border-radius-single'].parse, 'border-bottom-left-radius'),
	'-moz-border-radius-bottomleft': valueWrapper.deprecated(valueBucket['border-radius-single'].parse, 'border-bottom-left-radius'),
	'-webkit-border-bottom-left-radius': valueWrapper.deprecated(valueBucket['border-radius-single'].parse, 'border-bottom-left-radius'),
	'border-bottom-right-radius': valueBucket['border-radius-single'].parse,
	'-khtml-border-bottom-right-radius': valueWrapper.deprecated(valueBucket['border-radius-single'].parse, 'border-bottom-right-radius'),
	'-moz-border-radius-bottomright': valueWrapper.deprecated(valueBucket['border-radius-single'].parse, 'border-bottom-right-radius'),
	'-webkit-border-bottom-right-radius': valueWrapper.deprecated(valueBucket['border-radius-single'].parse, 'border-bottom-right-radius'),
	'border-bottom-style': valueBucket['border-style'].parse,
	'border-bottom-width': valueBucket['border-width-single'].parse,
	'border-collapse': valueBucket['border-collapse'].parse,
	'border-color': valueBucket['border-color'].parse,
	'border-left': valueBucket['border-single'].parse,
	'border-left-style': valueBucket['border-style'].parse,
	'border-left-width': valueBucket['border-width-single'].parse,
	'border-radius': valueBucket['border-radius'].parse,
	'-khtml-border-radius': valueWrapper.deprecated(valueBucket['border-radius'].parse, 'border-radius'),
	'-moz-border-radius': valueWrapper.deprecated(valueBucket['border-radius'].parse, 'border-radius'),
	'-o-border-radius': valueWrapper.wrongProperty(valueBucket['border-radius'].parse, 'border-radius'), // This was never supported in Opera
	'-webkit-border-radius': valueWrapper.deprecated(valueBucket['border-radius'].parse, 'border-radius'),
	'border-right': valueBucket['border-single'].parse,
	'border-right-style': valueBucket['border-style'].parse,
	'border-right-width': valueBucket['border-width-single'].parse,
	'border-spacing': valueBucket['border-spacing'].parse,
	'border-style': valueBucket['border-style'].parse,
	'border-top': valueBucket['border-single'].parse,
	'border-top-left-radius': valueBucket['border-radius-single'].parse,
	'-khtml-border-top-left-radius': valueWrapper.deprecated(valueBucket['border-radius-single'].parse, 'border-top-left-radius'),
	'-moz-border-radius-topleft': valueWrapper.deprecated(valueBucket['border-radius-single'].parse, 'border-top-left-radius'),
	'-webkit-border-top-left-radius': valueWrapper.deprecated(valueBucket['border-radius-single'].parse, 'border-top-left-radius'),
	'border-top-right-radius': valueBucket['border-radius-single'].parse,
	'-khtml-border-top-right-radius': valueWrapper.deprecated(valueBucket['border-radius-single'].parse, 'border-top-right-radius'),
	'-moz-border-radius-topright': valueWrapper.deprecated(valueBucket['border-radius-single'].parse, 'border-top-right-radius'),
	'-webkit-border-top-right-radius': valueWrapper.deprecated(valueBucket['border-radius-single'].parse, 'border-top-right-radius'),
	'border-top-style': valueBucket['border-style'].parse,
	'border-top-width': valueBucket['border-width-single'].parse,
	'border-width': valueBucket['border-width'].parse,
	'bottom': valueBucket['offset'].parse,
	'box-shadow': valueBucket['box-shadow'].parse,
	'-moz-box-shadow': valueBucket['box-shadow'].parse,
	'-webkit-box-shadow': valueBucket['box-shadow'].parse,
	'clear': valueBucket['clear'].parse,
	'color': valueBucket['color'].parse,
	'content': valueBucket['content'].parse,
	'cursor': valueBucket['cursor'].parse,
	'display': valueBucket['display'].parse,
	'filter': valueWrapper.unofficial(valueBucket['filter'].parse, 'ie'),
	'-ms-filter': valueWrapper.wrongProperty(valueBucket['filter'].parse, 'filter'),  // IE supports filter better than -ms-filter
	'float': valueBucket['float'].parse,
	'font': valueBucket['font'].parse,
	'font-family': valueBucket['font-family'].parse,
	'font-size': valueBucket['font-size'].parse,
	'font-style': valueBucket['font-style'].parse,
	'font-weight': valueBucket['font-weight'].parse,
	'height': valueBucket['height'].parse,
	'left': valueBucket['offset'].parse,
	'line-height': valueBucket['line-height'].parse,
	'list-style': valueBucket['list-style'].parse,
	'list-style-image': valueBucket['list-style-image'].parse,
	'list-style-position': valueBucket['list-style-position'].parse,
	'list-style-type': valueBucket['list-style-type'].parse,
	'margin': valueBucket['margin'].parse,
	'margin-bottom': valueBucket['margin-width'].parse,
	'margin-left': valueBucket['margin-width'].parse,
	'margin-right': valueBucket['margin-width'].parse,
	'margin-top': valueBucket['margin-width'].parse,
	'max-height': valueBucket['max-length'].parse,
	'max-width': valueBucket['max-length'].parse,
	'min-height': valueBucket['min-length'].parse,
	'min-width': valueBucket['min-length'].parse,
	'opacity': valueBucket['opacity'].parse,
	'outline': valueBucket['outline'].parse,
	'outline-color': valueBucket['outline-color'].parse,
	'outline-style': valueBucket['outline-style'].parse,
	'outline-width': valueBucket['min-length'].parse,
	'overflow': valueBucket['overflow'].parse,
	'overflow-x': valueBucket['overflow-dimension'].parse,
	'overflow-y': valueBucket['overflow-dimension'].parse,
	'padding': valueBucket['padding'].parse,
	'padding-bottom': valueBucket['padding-width'].parse,
	'padding-left': valueBucket['padding-width'].parse,
	'padding-right': valueBucket['padding-width'].parse,
	'padding-top': valueBucket['padding-width'].parse,
	'position': valueBucket['position'].parse,
	'progress-appearance': valueWrapper.wrongProperty(valueBucket['ms-progress-appearance'].parse, 'ms-progress-appearance'),
	'-ms-progress-appearance': valueBucket['ms-progress-appearance'],
	'right': valueBucket['offset'].parse,
	'scrollbar-3dlight-color': valueBucket['color'].parse,
	'-ms-scrollbar-3dlight-color': valueWrapper.wrongProperty(valueBucket['color'].parse, 'scrollbar-3dlight-color'), // Only in IE8 standards mode
	'scrollbar-arrow-color': valueBucket['color'].parse,
	'-ms-scrollbar-arrow-color': valueWrapper.wrongProperty(valueBucket['color'].parse, 'scrollbar-arrow-color'), // Only in IE8 standards mode
	'scrollbar-base-color': valueBucket['color'].parse,
	'-ms-scrollbar-base-color': valueWrapper.wrongProperty(valueBucket['color'].parse, 'scrollbar-base-color'), // Only in IE8 standards mode
	'scrollbar-darkshadow-color': valueBucket['color'].parse,
	'-ms-scrollbar-darkshadow-color': valueWrapper.wrongProperty(valueBucket['color'].parse, 'scrollbar-darkshadow-color'), // Only in IE8 standards mode
	'scrollbar-face-color': valueBucket['color'].parse,
	'-ms-scrollbar-face-color': valueWrapper.wrongProperty(valueBucket['color'].parse, 'scrollbar-face-color'), // Only in IE8 standards mode
	'scrollbar-highlight-color': valueBucket['color'].parse,
	'-ms-scrollbar-highlight-color': valueWrapper.wrongProperty(valueBucket['color'].parse, 'scrollbar-highlight-color'), // Only in IE8 standards mode
	'scrollbar-shadow-color': valueBucket['color'].parse,
	'-ms-scrollbar-shadow-color': valueWrapper.wrongProperty(valueBucket['color'].parse, 'scrollbar-shadow-color'), // Only in IE8 standards mode
	'scrollbar-track-color': valueBucket['color'].parse,
	'-ms-scrollbar-track-color': valueWrapper.wrongProperty(valueBucket['color'].parse, 'scrollbar-track-color'), // Only in IE8 standards mode
	'text-align': valueBucket['text-align'].parse,
	'text-decoration': valueBucket['text-decoration'].parse,
	'text-decoration-color': valueBucket['text-decoration-color'].parse,
	'text-decoration-style': valueBucket['text-decoration-style'].parse,
	'text-indent': valueBucket['text-indent'].parse,
	'text-overflow': valueBucket['text-overflow'].parse,
	'text-shadow': valueBucket['text-shadow'].parse,
	'-o-text-overflow': valueBucket['text-overflow'].parse,
	'text-transform': valueBucket['text-transform'].parse,
	'top': valueBucket['offset'].parse,
	'vertical-align': valueBucket['vertical-align'].parse,
	'visibility': valueBucket['visibility'].parse,
	'white-space': valueBucket['white-space'].parse,
	'width': valueBucket['width'].parse,
	'z-index': valueBucket['z-index'].parse,
	'zoom': valueWrapper.unofficial(valueBucket['zoom'].parse, 'ie'),
	'-ms-zoom': valueWrapper.wrongProperty(valueBucket['zoom'].parse, 'ie') // Only in IE8 standards mode
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
	result.unparsed.skipWhitespace();

	if (result.unparsed.length()) {
		bucket.parser.addWarning("extra-tokens-after-value", result.unparsed.firstToken());
	}

	declaration.value.setTokens([ result, result.unparsed ]);
	return declaration;
};
