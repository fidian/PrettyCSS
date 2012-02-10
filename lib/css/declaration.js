var base = require('./base');
var property = require('./property');
var util = require('../util');
var value = require('./value');

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

exports.canStartWith = function (token, tokens, container) {
	// Needs to match property + S* + COLON
	if (! property.canStartWith(token, tokens, container)) {
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

	declaration.property = property.parse(tokens, parser, container);
	var nextToken = tokens.getToken();

	if (nextToken.type != "COLON") {
		base.unexpectedToken("expected_colon", nextToken);
	}

	tokens.next();
	declaration.value = value.parse(tokens, parser, container);
	return declaration;
};
