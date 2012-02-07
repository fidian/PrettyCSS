var base = require('./base');

var CDC = (function (parser) {
	this._super(null, parser);
	return this;
}).childOf(base.base).extendPrototype({
	name: 'cdc',
	toString: function () {
		this.debug('toString', this.list);
		return this.addPreAndPost('cdc', '-->');
	}
});

exports.canStartWith = function (token) {
	return token.type == 'CDC';
};

exports.parse = function (tokens, parser) {
	var cdc = new CDC(parser);
	cdc.debug('parse', tokens);
	cdc.add(tokens.getToken());
	tokens.next();
	return cdc;
};
