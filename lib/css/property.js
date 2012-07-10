"use strict";

var base = require('./base');
var util = require('../util');

var Property = base.baseConstructor();

util.extend(Property.prototype, base.base, {
	name: "property",

	getPropertyName: function () {
		if (this.list.length > 1) {
			return this.list[0].toString() + this.list[1].toString();
		}

		return this.list[0].toString();
	},

	toString: function () {
		this.debug('toString', this.list);
		var propertyName = this.getPropertyName();

		if (this.bucket.options.propertiesLowerCase) {
			propertyName = propertyName.toLowerCase();
		}
		
		return this.addWhitespace('property', propertyName);
	}
});

exports.canStartWith = function (token, tokens, bucket) {
	if (token.type == 'IDENT') {
		return true;
	}

	if (token.type == 'CHAR' && token.content == '*' && tokens.getToken(1).type == 'IDENT') {
		return true;
	}

	return false;
};

exports.parse = function (tokens, bucket, container) {
	var property = new Property(bucket, container);
	property.debug('parse', tokens);
	var thisToken = tokens.getToken();
	property.add(thisToken);
	var nextToken = tokens.nextToken();

	if (thisToken.type == 'CHAR' && thisToken.content == '*' && nextToken.type == 'IDENT') {
		property.add(nextToken);
		nextToken = tokens.nextToken();
	}

	if (nextToken && nextToken.type == 'S') {
		tokens.next();
	}
	
	return property;
};
