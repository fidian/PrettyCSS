"use strict";

exports.setOptions = function (override) {
	if (typeof override != "object") {
		override = {};
	}

	var options = {
		at_post: "",
		at_pre: "",
		at_whitespace: " ",
		atblock_post: "\n}",  // Must contain }
		atblock_pre: "{\n\t",  // Must contain {
		autocorrect: true,
		block_post: "\n}",  // Must contain }
		block_pre: "{",  // Must contain {
		cdc: "\n-->", // Either {w} or {w}CDC{w}
		cdo: "<!--\n", // Either {w} or {w}CDO{w}
		combinator_post: ' ',
		combinator_pre: ' ',
		comment_post: "",
		comment_pre: "  ",
		cssLevel: 3,
		debug: false,
		declaration_post: '',
		declaration_pre: '',
		fileEncoding: "utf-8",
		functionComma: ", ", // Must contain comma
		functionSpace: " ", // Must contain some whitespace
		important: " !important", // Must contain !{w}important
		indent: "\t",
		keyframe_post: "",
		keyframe_pre: "\n",
		keyframeselector_post: " ",
		keyframeselector_pre: "",
		propertiesLowerCase: true,
		property_post: "",
		property_pre: "\n",
		ruleset_post: "",
		ruleset_pre: "",
		selector_comma: ", ", // Must contain comma
		selector_post: " ",
		selector_pre: "",
		selector_whitespace: " ", // Must contain whitespace
		stylesheet_post: "",
		stylesheet_pre: "",
		stylesheet_whitespace: "\n\n",
		topcomment_post: "",
		topcomment_pre: "",
		value_post: "",
		value_pre: " ",
		valuesLowerCase: true
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
