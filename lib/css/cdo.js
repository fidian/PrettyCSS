"use strict";

var base = require('./base');
var util = require('../util');

var CDO = base.baseConstructor();

util.extend(CDO.prototype, base.base, {
	name: "cdo",
	
	toString: function () {
		this.debug('toString', this.list);
		return this.bucket.options.cdo;
	}
});

exports.canStartWith = function (token, tokens, bucket) {
	return token.type == 'CDO';
};

exports.parse = function (tokens, bucket, container) {
	var cdo = new CDO(bucket, container);
	cdo.debug('parse', tokens);
	cdo.add(tokens.getToken());
	tokens.next();
	return cdo;
};
