exports.replacementMarker = '##';
exports.noMessageDefined = 'No message defined for code ##';
exports.browsers = {
	'c': 'Google Chrome',
	'ff': 'Mozilla Firefox',
	'ie': 'Microsoft Internet Explorer',
	'o': 'Opera',
	's': 'Safari'
};
exports.errorText = 'Error';
exports.errorMessages = {
	'block-expected': 'After selectors, an open brace is expected for defining a ruleset block; alternately there was a problem with a selector',
	'colon-expected': 'After property names in a declaration, a colon is required',
	'ident-after-colon': 'A colon must be followed by an identifier or a second colon',
	'ident-after-double-colon': 'A double colon must be followed by an identifier',
	'invalid-token': 'An invalid token was encountered - removing content until a semicolon or a block open + block close is found',
	'illegal-token-after-combinator': 'There was an illegal token after a combinator - combinators must be followed by another selector',
	'selector-expected': 'A selector is expected after a comma'
};
exports.warningText = 'Warning';
exports.warningMessages = {
	'add-quotes': 'To avoid confusion, this value should have quotes',
	'angle': 'Angles should start at 0 and be less than 360',
	'autocorrect': 'The value (##) has been autocorrected',
	'autocorrect-swap': 'The values have been autocorrected by swapping',
	'browser-only': 'Only works in one browser (##)',
	'browser-quirk': 'Behaves poorly in a browser (##)',
	'browser-unsupported': 'Unsupported in a browser (##)',
	'css-deprecated': 'Marked as deprecated in CSS version ##',
	'css-draft': 'This property is only in a working draft and is subject to change',
	'css-maximum': 'This works only up to CSS version ##',
	'css-minimum': 'This was introduced in CSS version ##',
	'css-unsupported': 'This is not supported in CSS version ##',
	'deprecated': 'Deprecated and should not be used - use ## instead',
	'extra-tokens-after-value': 'Extra tokens were found after a valid value - browsers may discard this entire property',
	'filter-case-sensitive': 'You used the wrong capitalization for a case sensitive property',
	'filter-use-equals-instead': 'You must use an equals here instead of colon',
	'font-family-one-generic': 'Exactly one generic font family should be used and it should be at the end',
	'hack': 'You use a ## hack at this location',
	'inherit-not-allowed': 'The value "inherit" is not allowed here',
	'illegal': 'This value is illegal',
	'invalid-value': 'The value for this property is invalid',
	'minmax-p-q': 'For minmax(p,q), the p should not be bigger than q',
	'mixing-percentages': 'You are not allowed to mix percentages with non-percentage values',
	'not-forward-compatible': 'This is not compatible with CSS version ## and forward',
	'range-max': 'The maximum value allowed is ##',
	'range-min': 'The minimum value allowed is ##',
	'remove-quotes': 'This value should not be quoted',
	'require-integer': 'This value must be an integer',
	'require-positive-value': 'This value must be positive',
	'require-value': 'Properties require a value',
	'reserved': 'Reserved for future use',
	'suggest-relative-unit': 'You should use a relative unit instead of ##',
	'suggest-remove-unit': 'You should remove ## from this',
	'suggest-using': 'You should use ## instead',
	'text-align-invalid-string': 'If a string is specified, it must contain just one character',
	'unknown-property': '## is not a known property',
	'wrong-property': 'This is the wrong property name or is poorly supported - use ## instead'
};
