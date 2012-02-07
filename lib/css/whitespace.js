var base = require('./base');

var Whitespace = (function (parser) {
	this._super(null, parser);
	return this;
}).childOf(base.base).extendPrototype({
	name: "whitespace",
	toString: function () {
		this.debug('toString', this.list);
		return "";
	}
});

exports.canStartWith = function (token) {
	return token.type == 'S';
};

exports.parse = function (tokens, parser) {
	var whitespace = new Whitespace(parser);
	whitespace.debug('parse', tokens);
	whitespace.add(tokens.getToken());
	tokens.next();
	return whitespace;
};
