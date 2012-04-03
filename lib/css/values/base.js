"use strict";

var util = require('../../util');
var validate = require('./validate');

exports.base = {
	add: function (t) {
		this.list.push(t);
	},

	addWarning: function (warningCode, token) {
		this.warningList.push([warningCode, token]);
	},

	debug: function (message, tokens) {
		if (! this.bucket.options.debug) {
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
		this.bucket.parser.debug(message);

		if (typeof tokens != "undefined") {
			if (typeof tokens.getTokens != "undefined") {
				this.bucket.parser.debug(tokens.getTokens());
			} else {
				this.bucket.parser.debug(tokens);
			}
		}
	},

	doWarnings: function () {
		var myself = this;
		this.warningList.forEach(function (warningInfo) {
			myself.bucket.parser.addWarning.apply(myself.parser, warningInfo);
		});

		this.list.forEach(function (item) {
			if (item.doWarnings instanceof Function) {
				item.doWarnings();
			}
		});
	},

	firstToken: function () {
		if (this.list.length) {
			if (this.list[0].firstToken) {
				return this.list[0].firstToken();
			}

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
		var unparsed = this.unparsed.clone();
		var matchCount = 0;
		var listToAdd = [];
		this.isFunction = true;

		while (args.length) {
			if (matchCount > 1) {
				// No comma after function name and first argument
				if (! unparsed.isTypeContent('OPERATOR', ',')) {
					return false;
				}

				unparsed.advance();  // Skip comma and possibly whitespace
			}

			var parsed = unparsed.matchAny(args.shift(), this);

			if (! parsed) {
				return false;
			}

			unparsed = parsed.unparsed.clone();
			listToAdd.push(parsed);
			matchCount ++;
		}

		if (! unparsed.isTypeContent('PAREN_CLOSE', ')')) {
			return false;
		}

		unparsed.advance();  // Skip the close parenthesis
		this.unparsed = unparsed;
		var myself = this;
		listToAdd.forEach(function (item) {
			myself.add(item);
		});

		return true;
	},

	handleInherit: function (validator) {
		if (this.unparsed.isContent('inherit')) {
			var newUnparsed = this.unparsed.clone();
			this.add(newUnparsed.advance());
			this.unparsed = newUnparsed;
			if (typeof validator == 'undefined') {
				validate.call(this, 'minimumCss', this.firstToken(), 2);
			} else {
				validator(this);
			}
			return true;
		}

		return false;
	},

	isInherit: function () {
		// Check if any are "inherit"
		var token = null;
		return this.list.some(function (value) {
			// If a "value" object
			if (value.isInherit) {
				token = value.isInherit();
				return !! token;
			}

			// Must be a token
			if (value.content.toLowerCase() == 'inherit') {
				token = value;
				return true;
			}

			return false;
		});
	},

	repeatParser: function (possibilities, maxHits) {
		var myself = this;
		var matches = [];
		var keepGoing = true;
		var unparsed = this.unparsed.clone();

		if (! (possibilities instanceof Array)) {
			possibilities = [ possibilities ];
		}

		while (keepGoing && unparsed.length()) {
			var matchedSomething = false;

			// Copy the unparsed tokens in case the comma + parser fail
			var unparsedCopy = unparsed.clone();

			if (this.repeatWithCommas && matches.length > 0) {
				if (unparsed.isTypeContent('OPERATOR', ',')) {
					unparsed.advance();
				} else {
					keepGoing = false;
				}
			}

			if (keepGoing && possibilities.some(function (tryMe) {
				var result = unparsed.match(tryMe, myself);

				if (result) {
					matches.push(result);
					unparsed = result.unparsed;
					return true;
				}

				return false;
			})) {
				// Parsed one successfully
				matchedSomething = true;
			}

			if (! matchedSomething) {
				// Restore if we didn't get a comma + valid thing
				unparsed = unparsedCopy;
				keepGoing = false;
			}

			if (maxHits && matches.length >= maxHits) {
				keepGoing = false;
			}
		}

		matches.forEach(function (item) {
			myself.add(item);
		});
		this.unparsed = unparsed;
		return matches.length;
	},

	scanRules: function () {
		var unparsed = this.unparsed.clone();
		var firstToken = unparsed.firstToken();
		var myBucket = this.bucket;

		if (! firstToken) {
			this.debug('parse fail - no tokens');
			return null;
		}

		var tokenContent = firstToken.content.toLowerCase();
		var rules = this.allowed;

		for (var i = 0; i < rules.length; i ++) {
			var rule = rules[i];
			var values = rule.values;

			if (! values) {
				values = [];
			}

			if (rule.valueObjects) {
				rule.valueObjects.forEach(function (objectName) {
					values.push(myBucket[objectName]);
				});
			}
			
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
			var ret = value.parse(unparsed, this.bucket, this);

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
			out = fn + out.join(this.bucket.options.functionComma) + ')';
		} else if (this.repeatWithCommas) {
			out = out.join(this.bucket.options.functionComma);

			if (this.bucket.options.valuesLowerCase) {
				out = out.toLowerCase();
			}
		} else {
			out = out.join(' ');  // TODO: configurable whitespace?

			if (this.bucket.options.valuesLowerCase) {
				out = out.toLowerCase();
			}
		}

		return out;
	},

	warnIfInherit: function () {
		var token = this.isInherit();

		if (token) {
			myself.addWarning('inherit_not_allowed', token);
		}
	},

	warnIfMixingPercents: function (token, valueList) {
		var listCountPercent = 0;

		valueList.forEach(function (val) {
			if (val.name == 'percentage') {
				listCountPercent ++;
			}
		});

		if (listCountPercent !== 0 && listCountPercent != valueList.length) {
			this.addWarning('mixing_percentages_and_values', token);
		}
	},

	warnIfNotInteger: function (token, value) {
		if (arguments.length < 2) {
			value = token.content;
		}

		if (! (/^[-+]?[0-9]+$/).test(value)) {
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
			return max;
		}
		if (v < min) {
			this.addWarning('out_of_range_min_' + min, token);
			return min;
		}

		return v;
	},

	warnIfTooManyRepeatingAttributes: function (list, maxLength) {
		if (list.length > maxLength) {
			this.addWarning('too_many_repeating_attributes_' + maxLength, list[maxLength]);
		}
	}
};

exports.baseConstructor = function () {
	return function (bucket, container, unparsed) {
		this.container = container;
		this.list = [];
		this.bucket = bucket;
		this.warningList = [];
		this.unparsed = unparsed;
	};
};

var regexpExpansions = {
	'n': "[0-9]*\\.?[0-9]+",  // Number
	'w': "[ \\n\\r\\f\\t]"  // Whitespace, as defined by CSS spec
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
	return function (unparsed, bucket, container) {
		var simpleObj = new baseObj(bucket, container, unparsed);
		simpleObj.debug('parse', unparsed);
		return simpleObj.scanRules();
	};
};
