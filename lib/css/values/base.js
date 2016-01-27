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
			myself.bucket.parser.addWarning.apply(myself.bucket.parser, warningInfo);
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

	fontValidation: function (hitsForCss2Only) {
		var token = this.firstToken();

		if (hitsForCss2Only && hitsForCss2Only > 1) {
			validate.call(this, 'notForwardCompatible', token, 3);
		}

		validate.call(this, 'minimumCss', token, 2);
		validate.call(this, 'unsupportedCss', token, 2.1);
		this.warnIfInherit();
	},

	functionParser: function () {
		if (arguments.length < 1) {
			// Must have function name
			return null;
		}

		var args = Array.prototype.slice.call(arguments);
		var matchCount = 0;
		var listToAdd = [];
		var unparsedCopy = this.unparsed.clone();
		this.isFunction = true;
		var parsed = null;

		while (args.length) {
			if (matchCount > 1) {
				// No comma after function name and first argument
				if (! unparsedCopy.isTypeContent('OPERATOR', ',')) {
					return false;
				}

				unparsedCopy.advance();  // Skip comma and possibly whitespace
			}

			if (matchCount === 0) {
				parsed = null;

				if (unparsedCopy.isTypeContent('FUNCTION', args[0].toLowerCase())) {
					parsed = unparsedCopy.advance();
					parsed.content = args.shift();  // This fixes capitalization
					parsed.unparsed = unparsedCopy;
				}
			} else {
				parsed = unparsedCopy.matchAny(args.shift(), this);
			}

			if (! parsed) {
				return false;
			}

			unparsedCopy = parsed.unparsed;
			listToAdd.push(parsed);
			matchCount ++;
		}

		if (! unparsedCopy.isTypeContent('PAREN_CLOSE', ')')) {
			return false;
		}

		unparsedCopy.advance();  // Skip the close parenthesis
		this.unparsed = unparsedCopy;
		var myself = this;
		listToAdd.forEach(function (item) {
			myself.add(item);
		});

		return true;
	},

	handleAll: function () {
		if (this.unparsed.isContent('all')) {
			this.add(this.unparsed.advance());
			validate.call(this, 'minimumCss', this.firstToken(), 2);
			validate.call(this, 'maximumCss', this.firstToken(), 2);
			validate.call(this, 'notForwardCompatible', this.firstToken(), 3);
			return true;
		}

		return false;
	},
	
	handleInherit: function (validator) {
		if (this.unparsed.isContent('inherit')) {
			this.add(this.unparsed.advance());

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

	length: function () {
		return this.list.length;
	},

	repeatParser: function (possibilities, maxHits) {
		var myself = this;
		var matches = [];
		var keepGoing = true;

		if (! (possibilities instanceof Array)) {
			possibilities = [ possibilities ];
		}

		while (keepGoing && this.unparsed.length()) {
			var matchedSomething = false;

			// Copy the unparsed tokens in case the comma + parser fail
			var unparsedCopy = this.unparsed.clone();

			if (this.repeatWithCommas && matches.length > 0) {
				if (this.unparsed.isTypeContent('OPERATOR', ',')) {
					this.unparsed.advance();
				} else {
					keepGoing = false;
				}
			}

			if (keepGoing && possibilities.some(function (tryMe) {
				var result = myself.unparsed.match(tryMe, myself);

				if (result) {
					matches.push(result);
					myself.unparsed = result.unparsed;
					return true;
				}

				return false;
			})) {
				// Parsed one successfully
				matchedSomething = true;
			}

			if (! matchedSomething) {
				// Restore if we didn't get a comma + valid thing
				this.unparsed = unparsedCopy;
				keepGoing = false;
			}

			if (maxHits && matches.length >= maxHits) {
				keepGoing = false;
			}
		}

		matches.forEach(function (item) {
			myself.add(item);
		});
		return matches.length;
	},

	scanRules: function () {
		var firstToken = this.unparsed.firstToken();
		var myBucket = this.bucket;

		if (! firstToken) {
			this.debug('parse fail - no tokens');
			return null;
		}

		var tokenContent = firstToken.content.toLowerCase();
		var rules = this.allowed;

		for (var i = 0; i < rules.length; i ++) {
			var rule = rules[i];

			if (! rule.values) {
				rule.values = [];
			}

			if (rule.valueObjects) {
				rule.valueObjects.forEach(function (objectName) {
					rule.values.push(myBucket[objectName]);
				});
				rule.valueObjects = null;
			}
			
			for (var j = 0; j < rule.values.length; j ++) {
				var result = this.testRuleValue(rule.values[j], tokenContent, rule);

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

	testRuleValueSuccess: function (rule) {
		var token = this.unparsed.advance();
		this.add(token);
		this.testRuleValidation(rule, token);
		return this;
	},

	testRuleValue: function (value, tokenContent, rule) {
		if (value instanceof RegExp) {
			this.debug('testRuleValue vs RegExp ' + value.toString());

			if (value.test(tokenContent)) {
				return this.testRuleValueSuccess(rule);
			}
		} else if (value.parse instanceof Function) {
			this.debug('testRuleValue vs func ' + value.toString());
			var ret = value.parse(this.unparsed, this.bucket, this);

			if (ret) {
				this.add(ret);
				this.testRuleValidation(rule, ret);
				this.unparsed = ret.unparsed;
				return this;
			}
		} else {
			this.debug('testRuleValue vs string ' + value.toString());

			if (value == tokenContent) {
				return this.testRuleValueSuccess(rule);
			}
		}

		return null;
	},

	toString: function () {
		return this.toStringChangeCase(false);
	},

	toStringChangeCase: function (changeCase) {
		this.debug('toString');
		var out = [];

		if (!! this.preserveCase) {
			changeCase = false;
		}

		this.list.forEach(function (value) {
			out.push(value.toStringChangeCase(changeCase));
		});

		if (this.isFunction) {
			var fn = out.shift();

			if (fn.substr(-1) != '(' && out[0] == '(') {
				fn += out.shift();
			}

			out = fn + out.join(this.bucket.options.functionComma) + ')';
		} else if (this.repeatWithCommas) {
			out = out.join(this.bucket.options.functionComma);
		} else {
			out = out.join(this.bucket.options.functionSpace);
		}

		return out;
	},

	validateColorValues: function (isHue) {
        var allColors, firstOne, myself;
        myself = this;
        allColors = this.list.slice(1, 4);

        if (isHue) {
            allColors.shift();
        }

        firstOne = this.list[0];
		this.warnIfMixingPercents(firstOne, allColors);

		// The colors will be numbers or percents
		// Values must be positive and between 0-100% or 0-255
		allColors.forEach(function (token) {
			if (token.name == 'number') {
				myself.warnIfNotInteger(token, token.getValue());
				token.setValue(Math.round(token.getValue()));
				token.setValue(myself.warnIfOutsideRange(token.firstToken(), 0, 255, token.getValue()));
			} else {
				// Percents all must be integers, so the
				// warning is in that object instead
				token.setValue(myself.warnIfOutsideRange(token.firstToken(), 0, 100, token.getValue()));
			}
		});

		// The last one, if it exists, is the alpha
		if (this.list.length < 5) {
			return;
		}

		var alpha = this.list[4];
		alpha.setValue(this.warnIfOutsideRange(alpha, 0, 1, alpha.getValue()));
	},

	warnIfInherit: function () {
		var token = this.isInherit();

		if (token) {
			this.addWarning('inherit-not-allowed', token);
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
			this.addWarning('mixing-percentages', token);
		}
	},

	warnIfNotInteger: function (token, value) {
		if (arguments.length < 2) {
			value = token.content;
		}

		if (! (/^[-+]?[0-9]+$/).test(value)) {
			this.addWarning('require-integer', token);
		}
	},

	warnIfOutsideRange: function (token, min, max, value) {
		if (arguments.length < 4) {
			value = token.content;
		}

		var v = (+value);

		if (v > max) {
			this.addWarning('range-max:' + max, token);
			return max;
		}
		if (v < min) {
			this.addWarning('range-min:' + min, token);
			return min;
		}

		return v;
	}
};

exports.baseConstructor = function () {
	return function (bucket, container, unparsed) {
		this.container = container;
		this.list = [];
		this.bucket = bucket;
		this.warningList = [];
		this.unparsed = unparsed.clone();
	};
};

var regexpExpansions = {
	'n': "([0-9]+(\\.[0-9]*)?|[0-9]*\\.?[0-9]+)",  // Number
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
		simpleObj.debug('parse', simpleObj.unparsed);
		return simpleObj.scanRules();
	};
};
