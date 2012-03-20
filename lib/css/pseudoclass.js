"use strict";

var base = require('./base');
var util = require('../util');

var PseudoClass = base.baseConstructor();

util.extend(PseudoClass.prototype, base.base, {
	name: "pseudoclass",

	toString: function () {
		this.debug('toString', this.list);
		return ":" + this.list.join("");
	}
});

exports.canStartWith = function (token, tokens) {
	return token.type == "COLON";
};

exports.parse = function (tokens, parser, container) {
	var pseudo = new PseudoClass(parser, container);
	pseudo.debug('parse', tokens);
	var token = tokens.getToken();
	pseudo.add(token);
	tokens.next();
	return pseudo;
};
