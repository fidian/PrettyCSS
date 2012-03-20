"use strict";

var base = require('./base');
var util = require('../util');

var PseudoElement = base.baseConstructor();

util.extend(PseudoElement.prototype, base.base, {
	name: "pseudoelement",

	toString: function () {
		this.debug('toString', this.list);
		return "::" + this.list.join("");
	}
});

exports.canStartWith = function (token, tokens) {
	return token.type == "COLON";
};

exports.parse = function (tokens, parser, container) {
	var pseudo = new PseudoElement(parser, container);
	pseudo.debug('parse', tokens);
	var token = tokens.getToken();
	pseudo.add(token);
	tokens.next();
	return pseudo;
};
