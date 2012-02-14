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
		cdo: "<!--\n", // Either {w} or {w}CDO{w}
		cdc: "\n-->", // Either {w} or {w}CDC{w}
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
	var exProp = function (dest, name, src) {
		// Recurse if merging objects, but not arrays nor functions
		if (typeof src == "object" && ! src instanceof Function && ! src instanceof Array) {
			dest[name] = exObj(dest[name], src);
		} else if (src !== undefined) {
			dest[name] = src;
		}
	};

	var exObj = function () {
		var target = arguments[0] || {},
			i = 1,
			length = arguments.length;

		while (i < arguments.length) {
			var addMe = arguments[i];

			for (var name in addMe) {
				exProp(target, name, addMe[name]);
			}

			exProp(target, "constructor", addMe.constructor);
			exProp(target, "toString", addMe.toString);
			exProp(target, "valueOf", addMe.valueOf);

			i ++;
		}

		return target;
	};

	return exObj;
})();
