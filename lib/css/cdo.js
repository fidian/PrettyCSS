var base = require('./base');
var util = require('../util');

var CDO = base.baseConstructor();

util.extend(CDO.prototype, base.base, {
	name: "cdo",
	
	toString: function () {
		this.debug('toString', this.list);
		return this.parser.options.cdo;
	}
});

exports.canStartWith = function (token, tokens, container) {
	return token.type == 'CDO';
};

exports.parse = function (tokens, parser, container) {
	var cdo = new CDO(parser, container);
	cdo.debug('parse', tokens);
	cdo.add(tokens.getToken());
	tokens.next();
	return cdo;
};
