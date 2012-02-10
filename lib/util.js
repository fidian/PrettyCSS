exports.setOptions = function (override) {
	var options = {
		debug: false,
		fileEncoding: "utf-8",
		ruleset_pre: "",
		ruleset_post: "\n\n",
		declaration_pre: '',
		declaration_post: '',
		selector_pre: "",
		selector_post: " ",
		selector_whitespace: " ", // Must contain whitespace
		selector_comma: ", ", // Must contain comma
		block_pre: "{",  // Must contain {
		block_post: "\n}",  // Must contain }
		indent: "\t",
		property_pre: "\n",
		property_post: "",
		value_pre: " ",
		value_post: "",
		at_pre: "",
		at_post: "",
		at_whitespace: " ",
		important: " !important", // Must contain !{w}important
		cdo: "<!--", // Either {w} or {w}CDO{w}
		cdc: "-->", // Either {w} or {w}CDC{w}
		topcomment_pre: "",
		topcomment_post: "\n\n",
		comment_pre: "  ",
		comment_post: ""
	};

	return exports.extend({}, options, override);
};

// Extend an object with properties from subsequent objects
// Code based heavily on jQuery's version with far less error checking
exports.extend = (function (undefined) {
	return function () {
		var target = arguments[0] || {},
			i = 1,
			length = arguments.length;

		while (i < arguments.length) {
			var addMe = arguments[i];

			for (var name in addMe) {
				// Recurse if merging objects, but not arrays nor functions
				if (typeof addMe[name] == "object" && ! addMe[name] instanceof Function && ! addMe[name] instanceof Array) {
					target[name] = exports.extend(target[name], addMe[name]);
				} else if (addMe[name] !== undefined) {
					target[name] = addMe[name];
				}
			}

			i ++;
		}

		return target;
	};
})();
