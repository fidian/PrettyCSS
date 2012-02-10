exports.setOptions = function () {
	var options = {
		debug: false,
		fileEncoding: "utf-8",
		ruleset_pre: "",  // ugly
		ruleset_post: "\n\n",  // ugly
		declaration_pre: '',  // ugly
		declaration_post: '',  // ugly
		declarations_pre: '',  // ugly
		declarations_post: "\n",  // ugly
		selector_comma: ", ", // Must contain comma
		selector_whitespace: " ", // Must contain whitespace
		selector_list_pre: "",  // ugly
		selector_list_post: " ",  // ugly
		block_pre: "", // Needed?
		block_post: "", // Needed?
		selector_pre: "",
		selector_post: "",
		cdc_pre: "\n",
		cdc_post: "",
		cdo_pre: "",
		cdo_post: "\n",
		property_pre: "\n\t",
		property_post: "",
		value_pre: " ",
		value_post: "",
		comment_pre: "",
		comment_post: "\n\n",
		stylesheet_pre: "",
		stylesheet_post: "",
		at_pre: "",
		at_post: "",
		at_whitespace: " ",
		important: " !important", // Must contain !{w}important
		cdo: "<!--", // Either {w} or {w}CDO{w}
		cdc: "-->", // Either {w} or {w}CDC{w}
		indent: "\t",
		rulecomment_pre: " ",
		rulecomment_post: "\n"
	};

	for (var argIndex = 0; argIndex < arguments.length; argIndex ++) {
		if (arguments[argIndex]) {
			for (var name in arguments[argIndex]) {
				options[name] = arguments[argIndex][name];
			}
		}
	}

	return options;
};

// Extend an object with properties from subsequent objects
// Code based heavily on jQuery's version
exports.extend = (function (undefined) {
	return function () {
		var target = arguments[0] || {},
			i = 1,
			length = arguments.length;

		while (i < arguments.length) {
			var addMe = arguments[i];

			for (var name in addMe) {
				if (addMe[name] !== undefined) {
					target[name] = addMe[name];
				}
			}

			i ++;
		}

		return target;
	};
})();
