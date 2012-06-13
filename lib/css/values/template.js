/* <template>
 *
 * Used by <display> for creating templates
 * [ <string> [ / <row-height> ]? ]+ <col-width>*
 */

"use strict";

var base = require('./base');
var util = require('../../util');

var Template = base.baseConstructor();

util.extend(Template.prototype, base.base, {
	name: "template",

	toString: function () {
		return this.toStringChangeCase(false);
	},

	toStringChangeCase: function (changeCase) {
		this.debug('toString');
		var out = [];

		if (!! this.preserveCase) {
			changeCase = false;
		}

		this.rows.forEach(function (rowDef) {
			var rowOut = "";
			rowDef.forEach(function (rowDefPart) {
				rowOut += rowDefPart.toStringChangeCase();
			});
			out.push(rowOut);
		});

		this.columns.forEach(function (colDef) {
			out.push(colDef.toString());
		});

		return out.join(' ');
	}
});

exports.parse = function (unparsedReal, bucket, container) {
	var template = new Template(bucket, container, unparsedReal);
	var unparsed = unparsedReal.clone();
	var result = null;
	template.debug('parse', unparsed);
	template.rows = [];
	template.columns = [];
	template.addWarning('css-draft', unparsed.firstToken());

	// TODO:  Validate that number of columns are consistent
	// TODO:  Validate that there aren't more column widths than defined
	// TODO:  Should warn if fewer column widths are found (except 0 widths)
	// TODO:  If widths are all percentages, they must add to 100%, keeping
	// in mind that percentages might round poorly (do they round or are
	// they trimmed?  Spec doesn't say)
	// TODO:  Could trim * at end of column widths or add * to match columns
	while (unparsed.isType('STRING')) {
		// <string>
		var rowDef = [ unparsed.advance() ];

		// Look for the "/" - we might need to undo this
		if (unparsed.isContent('/')) {
			var unparsedBackup = unparsed.clone();
			var slashToken = unparsed.advance();
			result = bucket['row-height'].parse(unparsed, bucket, template);

			if (result) {
				// Successful row height parsing
				rowDef.push(slashToken);
				rowDef.push(result);
				template.add(result);  // for warnings
				template.rows.push(rowDef);
				unparsed = result.unparsed;
			} else {
				// Need to undo our changes to unparsed tokens
				unparsed = unparsedBackup;
			}
		} else {
			template.rows.push(rowDef);
		}
	}

	// Done parsing [ <string> [ / <row-height> ]? ]+
	if (template.rows.length === 0) {
		// Not a template - no strings found
		template.debug('parse fail');
		return null;
	}

	// Continue with <col-width>*
	result = true;

	while (unparsed.length() && result) {
		result = bucket['col-width'].parse(unparsed, bucket, template);

		if (result) {
			template.columns.push(result);
			template.add(result); // for warnings
			unparsed = result.unparsed.clone();
		}
	}

	template.debug('parse success', unparsed);
	template.unparsed = unparsed;
	template.warnIfInherit();
	return template;
};
