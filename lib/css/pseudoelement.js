"use strict";

var base = require('./base');
var util = require('../util');

var Pseudoelement = base.baseConstructor();

util.extend(Pseudoelement.prototype, base.base, {
	name: "pseudoelement",

	toString: function () {
		this.debug('toString', this.list);
		return this.list.join("");
	}
});

exports.canStartWith = function (token, tokens, bucket) {
	if (token.type != 'COLON') {
		return false;
	}

	if (tokens.getToken(1).type != 'COLON') {
		return false;
	}

	if (tokens.getToken(2).type != 'IDENT') {
		bucket.parser.addError('ident-after-double-colon', token);
		return false;
	}

	return true;
};

exports.parse = function (tokens, bucket, container) {
	var pseudo = new Pseudoelement(bucket, container);
	pseudo.debug('parse', tokens);

	// First colon
	var token = tokens.getToken();
	pseudo.add(token);

	// Second colon
	token = tokens.nextToken();
	pseudo.add(token);

	// ident
	token = tokens.nextToken();
	pseudo.add(token);
	tokens.next();

	return pseudo;
};
