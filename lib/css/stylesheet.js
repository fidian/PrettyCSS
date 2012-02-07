var base = require('./base');
var cdc = require('./cdc');
var cdo = require('./cdo');
var comment = require('./comment');
var invalid = require('./invalid');
var ruleset = require('./ruleset');
var whitespace = require('./whitespace');
var types = [
	cdc,
	cdo,
	comment,
	ruleset,
	whitespace
];

var Stylesheet = (function (parser) {
	this._super(null, parser);
	return this;
}).childOf(base.base).extendPrototype({
	name: "stylesheet",
	toString: function () {
		this.debug(this.name);
		this.debug('toString');
		return this.addPreAndPost('stylesheet', this.list);
	}
});

exports.parse = function (tokens, parser) {
	var styles = new Stylesheet(parser);
	styles.debug('parse', tokens);

	while (tokens.anyLeft()) {
		var token = tokens.getToken();
		
		var failed = types.every(function (type) {
			if (type.canStartWith(token)) {
				styles.add(type.parse(tokens, parser));

				// Return false to stop checking types and to signify a hit
				return false;
			}
			// Return true to continue to next type
			return true;
		});

		if (failed) {
			// Ignore up through either a semicolon or through a block
			styles.add(invalid.parse(tokens, parser));
		}
	}

	return styles;
};
