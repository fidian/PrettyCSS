exports.setOptions = function (override) {
	if (typeof override != "object") {
		override = {};
	}

	var options = {
		debug: false,
		fileEncoding: "utf-8",
		ruleset_pre: "",
		ruleset_post: "\n\n",
		combinator_pre: ' ',
		combinator_post: ' ',
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
		at_post: "\n\n",
		atblock_pre: "{\n\t",
		atblock_post: "\n}",
		at_whitespace: " ",
		important: " !important", // Must contain !{w}important
		cdo: "<!--\n", // Either {w} or {w}CDO{w}
		cdc: "\n-->", // Either {w} or {w}CDC{w}
		topcomment_pre: "",
		topcomment_post: "\n\n",
		comment_pre: "  ",
		comment_post: "",
		cssLevel: 3,
		propertiesLowerCase: true,
		valuesLowerCase: true,
		functionComma: ", " // Must contain comma
	};

	return exports.extend({}, options, override);
};

// Extend an object with properties from subsequent objects
// Code based heavily on jQuery's version with far less error checking
exports.extend = (function (undefined) {
	var exProp = function (dest, name, src) {
		if (! src.hasOwnProperty(name)) {
			return;
		}

		var srcName = src[name];

		// Recurse if merging objects, but not arrays nor functions
		if (typeof srcName == "object" && ! srcName instanceof Function && ! srcName instanceof Array) {
			dest[name] = exObj(dest[name], srcName);
		} else if (srcName !== undefined) {
			dest[name] = srcName;
		}
	};

	var exObj = function () {
		var target = arguments[0] || {},
			i = 1,
			length = arguments.length;

		while (i < arguments.length) {
			var addMe = arguments[i];

			for (var name in addMe) {
				exProp(target, name, addMe);
			}

			exProp(target, "constructor", addMe);
			exProp(target, "toString", addMe);
			exProp(target, "valueOf", addMe);

			i ++;
		}

		return target;
	};

	return exObj;
})();

// Expand a pattern into a RegExp object
var subPat = /{([a-z][a-z0-9_]*)}/ig;
exports.expandIntoRegExpPattern = function (pattern, expansion) {
	while (subPat.test(pattern)) {
		pattern = pattern.replace(subPat, function (str, p) {
			if (expansion[p]) {
				return "(" + expansion[p] + ")";
			}

			throw "Invalid pattern referenced: " + p;
		});
	}

	return pattern;
};
