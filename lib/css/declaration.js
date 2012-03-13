var base = require('./base');
var invalid = require('./invalid');
var property = require('./property');
var util = require('../util');
var value = require('./value');

// Mapping properties to value types
var propertyMapping = {
	'background-color': require('./values/background-color'),
	'clear': require('./values/clear'),
	'color': require('./values/color'),
	'display': require('./values/display'),
	'float': require('./values/float'),
	'font-size': require('./values/font-size'),
	'font-weight': require('./values/font-weight'),
	'height': require('./values/height'),
	'margin-bottom': require('./values/margin-width'),
	'margin-left': require('./values/margin-width'),
	'margin-right': require('./values/margin-width'),
	'margin-top': require('./values/margin-width'),
	'text-align': require('./values/text-align'),
	'width': require('./values/width')
};

var Declaration = base.baseConstructor();

util.extend(Declaration.prototype, base.base, {
	name: "declaration",

	toString: function () {
		this.debug('toString')
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

	if (declaration.value.getLength() == 0) {
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
