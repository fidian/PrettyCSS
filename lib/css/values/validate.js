"use strict";

var getTokenAndValue = function (tokenOrObject) {
	var val = null;
	var token = tokenOrObject;

	if (tokenOrObject.firstToken) {
		token = tokenOrObject.firstToken();
	}
	if (typeof tokenOrObject.getValue == 'function') {
		// One of the basic "value" objects
		val = tokenOrObject.getValue();
		token = tokenOrObject.firstToken();
	} else {
		// Token, from tokenizer
		val = tokenOrObject.content;
		token = tokenOrObject;
	}

	return {
		token: token,
		value: val
	};
};

exports.autoCorrect = function (desired) {
	return function (token) {
		var warningToken = token.clone();
		this.addWarning('autocorrect:' + desired, warningToken);
		token.content = desired;
	};
};

exports.angle = function () {
	return function (token) {
		var matches = token.content.match(/^([-+0-9.]*)(.*)$/);
		var a = +matches[1];
		var unit = matches[2];
		var max = null;
		
		if (!unit && a == 0) {
			var warningToken = token.clone();
			this.addWarning('invalid-value', warningToken);
		}
		else {
			switch (unit) {
				case 'deg':
					max = 360;
					break;
	
				case 'grad':
					max = 400;
					break;
	
				case 'rad':
					max = 2 * Math.PI;
					break;
	
				case 'turn':
					max = 1;
					break;
	
				default:
					throw new Error('Unhandled angle unit: ' + token.getUnit());
			}
	
			if (a < 0 || a >= max) {
				var warningToken = token.clone();
				this.addWarning('angle', warningToken);
			}
	
			while (a < 0) {
				a += max;
			}
	
			while (a >= max) {
				a -= max;
			}
		}

		token.content = a.toFixed(10).replace(/\.?0+$/, '') + unit;
	};
};

exports.browserOnly = function (browserAndVersion) {
	return function (tokenOrObject) {
		var token = tokenOrObject;

		if (tokenOrObject.firstToken) {
			token = tokenOrObject.firstToken();
		}

		this.addWarning('browser-only:' + browserAndVersion, token);
	};
};

exports.browserQuirk = function (browserAndVersion) {
	return function (tokenOrObject) {
		var token = tokenOrObject;

		if (tokenOrObject.firstToken) {
			token = tokenOrObject.firstToken();
		}

		this.addWarning('browser-quirk:' + browserAndVersion, token);
	};
};

exports.browserUnsupported = function (browserAndVersion) {
	return function (tokenOrObject) {
		var token = tokenOrObject;

		if (tokenOrObject.firstToken) {
			token = tokenOrObject.firstToken();
		}

		this.addWarning('browser-unsupported:' + browserAndVersion, token);
	};
};

exports.call = function () {
	var args = Array.prototype.slice.call(arguments);
	var context = args.shift();  // Remove context
	var method = args.shift();  // Remove method
	var token = args.shift();

	if (typeof token == 'undefined') {
		token = context.firstToken();
	}

	var func = exports[method].apply(context, args);
	func.call(context, token);
};

exports.deprecated = function (deprecatedVersion, suggestion) {
	return function (tokenOrObject) {
		var warning = 'css-deprecated';
		
		if (deprecatedVersion) {
			warning += ':' + deprecatedVersion;
		}

		var token = tokenOrObject;

		if (tokenOrObject.firstToken) {
			token = tokenOrObject.firstToken();
		}

		this.addWarning(warning, token);
	};
};

exports.maximumCss = function (maxVersion) {
	return function (token) {
		if (! this.bucket.options.cssLevel || this.bucket.options.cssLevel > maxVersion) {
			this.addWarning('css-maximum:' + maxVersion, token);
		}
	};
};

exports.minimumCss = function (minVersion) {
	return function (token) {
		if (! this.bucket.options.cssLevel || this.bucket.options.cssLevel < minVersion) {
			this.addWarning('css-minimum:' + minVersion, token);
		}
	};
};

exports.notForwardCompatible = function (badVersion) {
	return function (token) {
		if (! this.bucket.options.cssLevel || this.bucket.options.cssLevel <= badVersion) {
			this.addWarning('not-forward-compatible:' + badVersion, token);
		}
	};
};

exports.numberPortionIsInteger = function () {
	return function (tokenOrObject) {
		var tv = getTokenAndValue(tokenOrObject);
		var num = tv.value.toString().match(/^[-+]?[0-9]*\.?[0-9]*/);
		
		if (! num || num.toString().indexOf('.') != -1) {
			this.addWarning('require-integer', tv.token);
		}
	};
};

exports.numberPortionIsNotZero = function () {
	return function (tokenOrObject) {
		var tv = getTokenAndValue(tokenOrObject);
		var num = tv.value.toString().match(/^[-+]?[0-9]*\.?[0-9]+/);
		
		if (+num === 0) {
			this.addWarning('suggest-remove-unit:' + this.getUnit(), tv.token);
		}
	};
};

exports.shouldNotBeQuoted = function () {
	return function (token) {
		this.addWarning('remove-quotes', token);
	};
};

exports.positiveValue = function () {
	return function (tokenOrObject) {
		var tv = getTokenAndValue(tokenOrObject);

		if (tv.value.toString().charAt(0) == '-') {
			this.addWarning('require-positive-value', tv.token);
		}
	};
};

exports.reserved = function () {
	return function (token) {
		this.addWarning('reserved', token);
	};
};

exports.suggestUsing = function (propertyName) {
	return function (token) {
		this.addWarning('suggest-using:' + propertyName, token);
	};
};

exports.suggestUsingRelativeUnits = function () {
	return function (token) {
		this.addWarning('suggest-relative-unit:' + this.getUnit(), token);
	};
};


exports.unsupportedCss = function (badVersion) {
	return function (token) {
		if (! this.bucket.options.cssLevel || this.bucket.options.cssLevel == badVersion) {
			this.addWarning('css-unsupported:' + badVersion, token);
		}
	};
};

exports.withinRange = function (min, max) {
	return function (obj) {
		obj.setValue(this.warnIfOutsideRange(obj, min, max, obj.getValue()));
	};
};

exports.workingDraft = function () {
	return function (token) {
		this.addWarning('css-draft', token);
	};
};
