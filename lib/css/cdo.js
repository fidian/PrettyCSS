var base = require('./base');

CDO = (function (parser) {
	this._super(null, parser);
	return this;
}).childOf(base.base).extendPrototype({
	name: "cdo",
	toString: function () {
		this.debug('toString', this.list);
		return this.addPreAndPost('cdo', '<!--');
	}
});

exports.canStartWith = function (token) {
	return token.type == 'CDO';
};

exports.parse = function (tokens, parser) {
	var cdo = new CDO(parser, 'cdo');
	cdo.debug('parse', tokens);
	cdo.add(tokens.getToken());
	tokens.next();
	return cdo;
};
