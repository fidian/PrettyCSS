"use strict";

var base = require('./base');
var util = require('../util');

var Property = base.baseConstructor();

util.extend(Property.prototype, base.base, {
	name: "property",

	getPropertyName: function () {
		return this.list[0].toString();
	},

	toString: function () {
		this.debug('toString', this.list);
		var propertyName = this.getPropertyName();

		if (this.parser.options.propertiesLowerCase) {
			propertyName = propertyName.toLowerCase();
		}
		
		return this.addWhitespace('property', propertyName);
	}
});

exports.canStartWith = function (token, tokens) {
	return token.type == 'IDENT';
};

exports.parse = function (tokens, parser, container) {
	var property = new Property(parser, container);
	property.debug('parse', tokens);
	property.add(tokens.getToken());
	var nextToken = tokens.nextToken();

	if (nextToken && nextToken.type == 'S') {
		tokens.next();
	}
	
	return property;
};
