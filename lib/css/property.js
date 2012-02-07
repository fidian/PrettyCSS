var base = require('./base');

var Property = (function (parser) {
	this._super(null, parser);
	return this;
}).childOf(base.base).extendPrototype({
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

exports.parse = function (tokens, parser) {
	var property = new Property(parser, 'property');
	property.debug('parse', tokens);
	property.add(tokens.getToken());
	var nextToken = tokens.nextToken();

	if (nextToken.type == 'S') {
		tokens.next();
	}
	
	return property;
};
