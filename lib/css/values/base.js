var length = require('./length');
var percentage = require('./percentage');
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
			if (typeof tokens.getTokens != "undefined") {
				this.parser.debug(tokens.getTokens());
			} else {
				this.parser.debug(tokens);
			}
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

	firstToken: function () {
		if (this.list.length) {
			return this.list[0];
		}

		return null;
	},

	functionParser: function () {
		if (arguments.length < 1) {
			// Must have function name
			return null;
		}

		var args = Array.prototype.slice.call(arguments);
		var unparsed = this.unparsed.clone()
		var matchCount = 0;
		this.isFunction = true;

		while (args.length) {
			if (matchCount > 1) {
				// No comma after function name and first argument
				if (! unparsed.isTypeContent('OPERATOR', ',')) {
					return false;
				}

				unparsed.advance();  // Skip comma and possibly whitespace
			}

			var parsed = unparsed.canMatch(args.shift(), this);

			if (! parsed) {
				return false;
			}

			unparsed = parsed.unparsed.clone();
			this.add(parsed);
			matchCount ++;
		}

		if (! unparsed.isTypeContent('PAREN_CLOSE', ')')) {
			return false;
		}

		unparsed.advance();
		this.unparsed = unparsed;

		return true;
	},

	isInherit: function () {
		// Check if any are "inherit"
		return this.list.some(function (value) {
			// If a "value" object
			if (value.isInherit) {
				return value.isInherit();
			}

			// Must be a token
			if (value.content.toLowerCase() == 'inherit') {
				return value;
			}

			return null;
		});
	},

	repeatParser: function (possibilities) {
		var myself = this;

		if (! (possibilities instanceof Array)) {
			possibilities = [ possibilities ];
		}

		while (this.unparsed.length()) {
			if (! possibilities.some(function (tryMe) {
				if (tryMe.parse) {
					var obj = tryMe.parse(myself.unparsed, myself.parser, myself);
					if (obj) {
						myself.add(obj);
						myself.unparsed = obj.unparsed;
						return true;
					}

					return false;
				}

				if (myself.unparsed.isContent(tryMe)) {
					myself.add(myself.unparsed.advance());
					return true;
				}

				return false;
			})) {
				return;
			}
		}
	},

	scanRules: function () {
		var unparsed = this.unparsed.clone();
		var firstToken = unparsed.firstToken();

		if (! firstToken) {
			this.debug('parse fail - no tokens');
			return null;
		}

		var tokenContent = firstToken.content.toLowerCase();
		var rules = this.allowed;

		for (var i = 0; i < rules.length; i ++) {
			var rule = rules[i];
			var values = rule.values;

			for (var j = 0; j < values.length; j ++) {
				var result = this.testRuleValue(values[j], tokenContent, unparsed, rule);

				if (result) {
					this.debug('parse success', result.unparsed);
					return result;
				}
			}
		}

		this.debug('parse fail');
		return null;
	},

	testRuleValidation: function (rule, tokenOrObject) {
		var myself = this;

		rule.validation.forEach(function (validationFunction) {
			// Call function in my context so it can use
			// this.addWarning();
			validationFunction.call(myself, tokenOrObject);
		});
	},

	testRuleValueSuccess: function (unparsedReal, rule) {
		var unparsed = unparsedReal.clone();
		var token = unparsed.advance();
		this.add(token);
		this.testRuleValidation(rule, token);
		this.unparsed = unparsed;
		return this;
	},

	testRuleValue: function (value, tokenContent, unparsed, rule) {
		if (value instanceof RegExp) {
			this.debug('testRuleValue vs RegExp ' + value.toString());

			if (value.test(tokenContent)) {
				return this.testRuleValueSuccess(unparsed, rule);
			}
		} else if (value.parse instanceof Function) {
			this.debug('testRuleValue vs func ' + value.toString());
			var ret = value.parse(unparsed, this.parser, this);

			if (ret) {
				this.add(ret);
				this.testRuleValidation(rule, ret);
				this.unparsed = ret.unparsed;
				return this;
			}
		} else {
			this.debug('testRuleValue vs string ' + value.toString());

			if (value == tokenContent) {
				return this.testRuleValueSuccess(unparsed, rule);
			}
		}

		return null;
	},

	toString: function () {
		this.debug('toString');
		var out = [];

		this.list.forEach(function (value) {
			out.push(value.toString());
		});

		if (this.isFunction) {
			var fn = out.shift();
			out = fn + out.join(this.parser.options.functionComma) + ')';
		} else {
			out = out.join(' ');  // TODO: configurable whitespace?

			if (this.parser.options.valuesLowerCase) {
				out = out.toLowerCase();
			}
		}

		return out;
	},

	warnIfInherit: function () {
		var myself = this;
		this.list.forEach(function (value) {
			var token = value.isInherit();
			if (token) {
				myself.addWarning('inherit_not_allowed', token);
			}
		});
	},

	warnIfMixingPercents: function (token, valueList) {
		var listCountPercent = 0;

		valueList.forEach(function (val) {
			if (val.name == 'percentage') {
				listCountPercent ++;
			}
		});

		if (listCountPercent != 0 && listCountPercent != valueList.length) {
			this.addWarning('mixing_percentages_and_values', token);
		}
	},

	warnIfNotInteger: function (token, value) {
		if (arguments.length < 2) {
			value = token.content;
		}

		if (! /^[-+]?[0-9]+$/.test(value)) {
			this.addWarning('only_integers_allowed', token);
		}
	},

	warnIfOutsideRange: function (token, min, max, value) {
		if (arguments.length < 4) {
			value = token.content;
		}

		var v = (+value);

		if (v > max) {
			this.addWarning('out_of_range_max_' + max, token);
			v = min;
		}
		if (v < min) {
			this.addWarning('out_of_range_min_' + min, token);
			v = min;
		}

		return v;
	}
};

exports.baseConstructor = function () {
	return function (parser, container, unparsed) {
		this.container = container;
		this.list = [];
		this.parser = parser;
		this.warningList = [];
		this.unparsed = unparsed;
	};
};

lengthOrPositionParse = function (unparsedReal, parser, container) {
	var ret = length.parse(unparsedReal, parser, container);

	if (! ret) {
		ret = percentage.parse(unparsedReal, parser, container);
	}

	return ret;
};

var regexpExpansions = {
	'n': "[0-9]*\\.?[0-9]+",  // Number
	'w': "[ \\n\\r\\f\\t]"  // Whitespace
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
	return function (unparsed, parser, container) {
		var simpleObj = new baseObj(parser, container, unparsed);
		simpleObj.debug('parse', unparsed);
		return simpleObj.scanRules();
	};
};
