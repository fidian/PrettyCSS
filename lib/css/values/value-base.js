var util = require('../../util');

exports.base = {
	add: function (t) {
		this.list.push(t);
	},

	addWarning: function (warningCode, token) {
		this.warningList.push([warningCode, token]);
	},

	debug: function (message, tokens) {
		if (! this.parser || ! this.parser.options.debug) {
			return;
		}

		// Count depth
		var lead = "";
		var ptr = this.container;

		while (ptr.container) {
			lead += "....";
			ptr = ptr.container;
		}

		message = lead + "[" + this.name + "] " + message;
		this.parser.debug(message);

		if (typeof tokens != "undefined") {
			this.parser.debug(tokens);
		}
	},

	doWarnings: function () {
		var myself = this;
		this.warningList.forEach(function (warningInfo) {
			myself.parser.addWarning.apply(myself.parser, warningInfo);
		});

		this.list.forEach(function (item) {
			if (item.doWarnings instanceof Function) {
				item.doWarnings();
			}
		});
	},

	scanRules: function (tokens) {
		var tokenContent = tokens[0].toString().toLowerCase();
		var rules = this.allowed;

		for (var i = 0; i < rules.length; i ++) {
			var rule = rules[i];
			var values = rule.values;

			for (var j = 0; j < values.length; j ++) {
				var result = this.testRuleValue(values[j], tokenContent, tokens, rule);

				if (result) {
					this.debug('parse success', result.tokens);
					return result;
				}
			}
		}

		this.debug('parse fail');
		return null;
	},

	testRuleValueSuccess: function (tokensReal, rule) {
		var tokens = tokensReal.slice(0);
		var token = tokens.shift();
		this.add(token);
		var myself = this;

		rule.validation.forEach(function (validationFunction) {
			validationFunction.call(myself, token);
		});

		if (tokens.length && tokens[0].type == 'S') {
			tokens.shift();
		}

		return {
			tokens: tokens,
			value: this
		};
	},

	testRuleValue: function (value, tokenContent, tokens, rule) {
		if (value instanceof RegExp) {
this.debug('testRuleValue vs RegExp ' + value.toString());
			if (value.test(tokenContent)) {
				return this.testRuleValueSuccess(tokens, rule);
			}
		} else if (value.parse instanceof Function) {
this.debug('testRuleValue vs func ' + value.toString());
			var ret = value.parse(tokens, this.parser, this);

			if (ret) {
				return ret;
			}
		} else {
this.debug('testRuleValue vs string ' + value.toString());
			if (value == tokenContent) {
				return this.testRuleValueSuccess(tokens, rule);
			}
		}

		return null;
	},

	toString: function () {
		// Probably should write out this.list, but then should abstract
		// out ../base.js's debug() instead of duplicating code
		this.debug('toString');
		var out = [];

		this.list.forEach(function (value) {
			out.push(value.toString());
		});

		out = out.join(' ');  // TODO: configurable whitespace?

		if (this.parser.options.valuesLowerCase) {
			out = out.toLowerCase();
		}

		return out;
	}
};

exports.baseConstructor = function () {
	return function (parser, container) {
		this.container = container;
		this.list = [];
		this.parser = parser;
		this.warningList = [];
		return this;
	};
};

var regexpExpansions = {
	'n': "[0-9]*\\.?[0-9]+",
	'w': "[ \\n\\r\\f\\t]",
};

exports.makeRegexp = function (pattern) {
	// All token pattern matches start at the beginning of the string
	// and must match the entire token
	pattern = "^" + pattern + "$";
	pattern = util.expandIntoRegExpPattern(pattern, regexpExpansions);

	// CSS tokens match insensitively
	return new RegExp(pattern, 'i');
};

exports.simpleParser = function (baseObj) {
	return function (tokensReal, parser, container) {
		var simpleObj = new baseObj(parser, container);
		var tokens = tokensReal.slice(0);
		simpleObj.debug('parse', tokens);
		return simpleObj.scanRules(tokens, 0);
	};
};
