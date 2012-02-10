var base = require('./base');
var util = require('../util');

var CDC = base.baseConstructor();

util.extend(CDC.prototype, base.base, {
	name: 'cdc',

	toString: function () {
		this.debug('toString', this.list);
		return this.addPreAndPost('cdc', this.parser.options.cdc);
	}
});

exports.canStartWith = function (token) {
	return token.type == 'CDC';
};

exports.parse = function (tokens, parser, container) {
	var cdc = new CDC(parser, container);
	cdc.debug('parse', tokens);
	cdc.add(tokens.getToken());
	tokens.next();
	return cdc;
};
