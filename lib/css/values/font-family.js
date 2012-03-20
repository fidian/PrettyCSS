/* <font-family>
 *
 * CSS1:  [ [ <font-family-name> | <font-family-generic-name> ] , ]* [ <font-family-name> | <font-family-generic-name> ]
 * CSS2:  inherit
 */

"use strict";

var base = require('./base');
var fontFamilyGenericName = require('./font-family-generic-name');
var fontFamilyName = require('./font-family-name');
var util = require('../../util');
var validate = require('./validate');

var FontFamily = base.baseConstructor();

util.extend(FontFamily.prototype, base.base, {
	name: "font-family"
});

exports.parse = function (unparsedReal, parser, container) {
	var ff = new FontFamily(parser, container, unparsedReal);
	var unparsed = unparsedReal.clone();
	ff.debug('parse', unparsedReal);

	if (unparsed.isContent('inherit')) {
		ff.add(unparsed.advance());
		ff.unparsed = unparsed;
		validate.call(ff, 'minimumCss', 2);
		return ff;
	}

	var result = true;
	var genericCount = 0;
	var genericWasLast = false;

	while (result) {
		// Match fontFamilyGenericName first so we know if a special
		// keyword-based font name was used
		result = fontFamilyGenericName.parse(unparsed, parser, ff);

		if (result) {
			genericCount ++;
			genericWasLast = true;
		} else {
			result = fontFamilyName.parse(unparsed, parser, ff);
			genericWasLast = false;
		}

		if (! result) {
			return null;
		}
	}

	if (! genericWasLast | genericCount != 1) {
		this.addWarning('font_family_one_generic_at_end', ff.firstToken());
	}

	ff.unparsed = unparsed;
	return ff;
};
