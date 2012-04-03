"use strict";

var base = require('./base');
var util = require('../util');

var Pseudoclass = base.baseConstructor();

util.extend(Pseudoclass.prototype, base.base, {
	name: "pseudoclass",

	toString: function () {
		this.debug('toString', this.list);
		return ":" + this.list.join("");
	}
});

exports.canStartWith = function (token, tokens, bucket) {
	return token.type == "COLON";
};

exports.parse = function (tokens, bucket, container) {
	var pseudo = new Pseudoclass(bucket, container);
	pseudo.debug('parse', tokens);
	var token = tokens.getToken();
	pseudo.add(token);
	tokens.next();
	return pseudo;
};
