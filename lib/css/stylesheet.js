var base = require('./base');
var atRule = require('./at-rule');
var cdc = require('./cdc');
var cdo = require('./cdo');
var comment = require('./comment');
var invalid = require('./invalid');
var ruleset = require('./ruleset');
var util = require('../util');
var whitespace = require('./whitespace');

var types = [
	atRule,
	cdc,
	cdo,
	comment,
	ruleset,
	whitespace
];

// Do not use base.baseConstructor() since container is optional here
var Stylesheet = function (parser, container) {
	this.init();
	this.setParser(parser);

	if (container) {
		this.setContainer(container);
	}

	return this;
};

util.extend(Stylesheet.prototype, base.base, {
	name: "stylesheet",

	toString: function () {
		this.debug(this.name);
		this.debug('toString');
		var out = this.addPreAndPost('stylesheet', this.list);
		return this.reindent(out);
	}
});

exports.parse = function (tokens, parser, container) {
	var styles = new Stylesheet(parser, container);
	styles.debug('parse', tokens);

	while (tokens.anyLeft()) {
		var token = tokens.getToken();
		
		var failed = types.every(function (type) {
			if (type.canStartWith(token)) {
				styles.add(type.parse(tokens, parser, this));

				// Return false to stop checking types and to signify a hit
				return false;
			}
			// Return true to continue to next type
			return true;
		});

		if (failed) {
			// Ignore up through either a semicolon or through a block
			styles.add(invalid.parse(tokens, parser, this));
		}
	}

	return styles;
};
