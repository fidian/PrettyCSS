var base = require('./base');
var property = require('./property');
var value = require('./value');

var Declaration = (function (parser) {
	this._super(null, parser);
	return this;
}).childOf(base.base).extendPrototype({
	name: "declaration",
	toString: function () {
		this.debug('toString')
		var out = this.property.toString();
		out += ":";
		out += this.value.toString();
		out += ";";
		return this.addPreAndPost('declaration', out);
	}
});

exports.canStartWith = property.canStartWith;

var isPartOfValue = function (token) {
	if (! token) {
		return false;
	}

	if (token.type == 'SEMICOLON' || token.type == 'BLOCK_CLOSE') {
		return false;
	}

	return true;
};

exports.parse = function (tokens, parser) {
	var declaration = new Declaration(parser, 'declaration');
	declaration.debug('parse', tokens);

	declaration.property = property.parse(tokens, parser);
	var nextToken = tokens.getToken();

	if (nextToken.type != "COLON") {
		base.unexpectedToken("expected_colon", nextToken);
	}

	tokens.next();
	declaration.value = value.parse(tokens, parser);
	return declaration;
};
