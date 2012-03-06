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

exports.deprecated = function (deprecatedVersion, suggestion) {
	return function (token) {
		var warning = 'deprecated_css_version_3';

		if (suggestion) {
			warning += '_use_' + suggestion;
		}

		this.addWarning(warning, token);
	}
};

exports.maximumCss = function (maxVersion) {
	return function (token) {
		if (this.parser.options.cssLevel > maxVersion) {
			this.addWarning('maximum_css_version_' + maxVersion, token);
		}
	}
};

exports.minimumCss = function (minVersion) {
	return function (token) {
		if (this.parser.options.cssLevel < minVersion) {
			this.addWarning('minimum_css_version_' + minVersion, token);
		}
	}
};

exports.notForwardCompatible = function (badVersion) {
	return function (token) {
		if (this.parser.options.cssLevel <= badVersion) {
			this.addWarning('not_forward_compatible_' + badVersion, token);
		}
	};
};

exports.positiveValue = function () {
	return function (token) {
		if (token.content.charAt(0) == '-') {
			this.addWarning('positive_value_required', token);
		}
	}
};

exports.suggestUsingRelativeUnits = function () {
	return function (token) {
		this.addWarning('suggest_using_relative_units', token);
	};
};

exports.workingDraft = function () {
	return function (token) {
		this.addWarning('working_draft', token);
	};
};
