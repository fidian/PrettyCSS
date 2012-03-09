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

	isInherit: function () {
		if (! this.list.length) {
			return false;
		}

		if (this.list[0].content && this.list[0].content == 'inherit') {
			return true;
		}

		if (this.list[0].isInherit && this.list[0].isInherit()) {
			return true;
		}

		return false;
	},

	scanRules: function (tokens) {
		var tokenContent = tokens.firstToken().content.toLowerCase();
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
		var tokens = tokensReal.clone();
		var token = tokens.advance();
		this.add(token);
		var myself = this;

		rule.validation.forEach(function (validationFunction) {
			validationFunction.call(myself, token);
		});

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

	warnIfNotInteger: function (token, value) {
		if (arguments.length < 2) {
			value = token.content;
		}

		if (! /^[-+]?[0-9]+$/.test(value)) {
			this.addWarning('only_integers_allowed', token);
		}
	},

	warnIfMixingPercents: function (token, valueList) {
		var listCountPercent = 0;
		var regexp = /^[0-9]*\.?[0-9]+%/;

		valueList.forEach(function (val) {
			if (regexp.test(val)) {
				listCountPercent ++;
			}
		});

		if (listCountPercent != 0 && listCountPercent != valueList.length) {
			this.addWarning('mixing_percents_and_values', token);
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
	return function (parser, container) {
		this.container = container;
		this.list = [];
		this.parser = parser;
		this.warningList = [];
		return this;
	};
};

exports.functionParser = function () {
	if (arguments.length < 3) {
		return null;
	}

	var args = Array.prototype.slice.call(arguments);
	var tokens = args.shift();
	var baseObject = args.shift();
	var matchCount = 0;
	baseObject.isFunction = true;

	while (args.length) {
		if (matchCount > 1) {
			// No comma after function name and first argument
			if (! tokens.isTypeContent('OPERATOR', ',')) {
				return null;
			}

			tokens.advance();  // Skip comma and possibly whitespace
		}

		var parsed = tokens.canMatch(args.shift(), baseObject.parser, baseObject);

		if (! parsed) {
			return null;
		}

		tokens = parsed.tokens;
		baseObject.add(parsed.value);
		matchCount ++;
	}

	if (! tokens.isTypeContent('PAREN_CLOSE', ')')) {
		return null;
	}

	tokens.advance();

	return tokens;
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
		var tokens = tokensReal.clone();
		simpleObj.debug('parse', tokens);
		return simpleObj.scanRules(tokens, 0);
	};
};
