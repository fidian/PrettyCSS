exports.setOptions = function () {
	var options = {
		debug: false,
		fileEncoding: "utf-8",
		ruleset_pre: "\n\n",  // ugly
		ruleset_post: "",  // ugly
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
		comment_pre: " ",
		comment_post: "",
		stylesheet_pre: "",
		stylesheet_post: ""
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
