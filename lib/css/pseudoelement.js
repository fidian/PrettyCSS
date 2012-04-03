"use strict";

var base = require('./base');
var util = require('../util');

var Pseudoelement = base.baseConstructor();

util.extend(Pseudoelement.prototype, base.base, {
	name: "pseudoelement",

	toString: function () {
		this.debug('toString', this.list);
		return "::" + this.list.join("");
	}
});

exports.canStartWith = function (token, tokens, bucket) {
	return token.type == "COLON";
};

exports.parse = function (tokens, bucket, container) {
	var pseudo = new Pseudoelement(bucket, container);
	pseudo.debug('parse', tokens);
	var token = tokens.getToken();
	pseudo.add(token);
	tokens.next();
	return pseudo;
};
