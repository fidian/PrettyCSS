var base = require('./base');
var util = require('../util');

var Property = base.baseConstructor();

util.extend(Property.prototype, base.base, {
	name: "property",

	toString: function () {
		this.debug('toString', this.list);
		return this.addPreAndPost('property', this.list);
	}
});

exports.canStartWith = function (token) {
	switch (token.type) {
		case 'IDENT':
			return true;
	}

	return false;
};

exports.parse = function (tokens, parser, container) {
	var property = new Property(parser, container);
	property.debug('parse', tokens);
	property.add(tokens.getToken());
	var nextToken = tokens.nextToken();

	if (nextToken.type == 'S') {
		tokens.next();
	}
	
	return property;
};
