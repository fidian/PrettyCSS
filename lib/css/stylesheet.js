var base = require('./base');
var atRule = require('./at-rule');
var cdc = require('./cdc');
var cdo = require('./cdo');
var comment = require('./comment');
var invalid = require('./invalid');
var ruleset = require('./ruleset');
var util = require('../util');
var whitespace = require('./whitespace');

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

	parseTokenList: [
		atRule,
		cdc,
		cdo,
		comment,
		ruleset,
		whitespace,
		invalid // Must be last
	],

	toString: function () {
		this.debug(this.name);
		this.debug('toString');
		var out = this.makeString(this.list);
		out = out.replace(/^[ \n\r\t\f]*|[ \n\r\t\f]*$/g, '');
		return out;
	}
});

exports.parse = function (tokens, parser, container) {
	var styles = new Stylesheet(parser, container);
	styles.debug('parse', tokens);

	while (tokens.anyLeft()) {
		styles.parseTokens(tokens);
	}

	return styles;
};
