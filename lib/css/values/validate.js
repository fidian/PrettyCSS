"use strict";

var getTokenAndValue = function (tokenOrObject) {
	var val = null;
	var token = null;

	if (typeof tokenOrObject.getValue == 'function') {
		// One of the "value" objects
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

exports.browserQuirk = function (browserAndVersion) {
	return function (token) {
		this.addWarning('browser_quirk_' + browserAndVersion, token);
	};
};

exports.browserUnsupported = function (browserAndVersion) {
	return function (token) {
		this.addWarning('browser_unsupported_' + browserAndVersion, token);
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
	return function (token) {
		var warning = 'deprecated_css';
		
		if (deprecatedVersion) {
			warning += '_v' + deprecatedVersion;
		}

		if (suggestion) {
			warning += '_use_' + suggestion;
		}

		this.addWarning(warning, token);
	};
};

exports.maximumCss = function (maxVersion) {
	return function (token) {
		if (this.parser.options.cssLevel > maxVersion) {
			this.addWarning('maximum_css_version_' + maxVersion, token);
		}
	};
};

exports.minimumCss = function (minVersion) {
	return function (token) {
		if (this.parser.options.cssLevel < minVersion) {
			this.addWarning('minimum_css_version_' + minVersion, token);
		}
	};
};

exports.notForwardCompatible = function (badVersion) {
	return function (token) {
		if (this.parser.options.cssLevel <= badVersion) {
			this.addWarning('not_forward_compatible_' + badVersion, token);
		}
	};
};

exports.numberPortionIsInteger = function () {
	return function (tokenOrObject) {
		var tv = getTokenAndValue(tokenOrObject);
		var num = tv.value.toString().match(/^[-+]?[0-9]*\.?[0-9]+/);
		
		if (! num || num.indexOf('.') != -1) {
			this.addWarning('integer_value_required', tv.token);
		}
	};
};

exports.shouldNotBeQuoted = function () {
	return function (token) {
		this.addWarning('should_not_be_quoted', token);
	};
};

exports.positiveValue = function () {
	return function (tokenOrObject) {
		var tv = getTokenAndValue(tokenOrObject);

		if (tv.value.toString().charAt(0) == '-') {
			this.addWarning('positive_value_required', tv.token);
		}
	};
};

exports.reserved = function () {
	return function (token) {
		this.addWarning('reserved_for_future_use', token);
	};
};

exports.suggestUsingRelativeUnits = function () {
	return function (token) {
		this.addWarning('suggest_using_relative_units', token);
	};
};


exports.unofficial = function () {
	return function (token) {
		var tv = getTokenAndValue(token);
		this.addWarning('unofficial', tv.token);
	};
};

exports.unsupportedCss = function (badVersion) {
	return function (token) {
		if (this.parser.options.cssLevel == badVersion) {
			this.addWarning('unsupported_css_version_' + badVersion, token);
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
		this.addWarning('working_draft', token);
	};
};
