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
	ff.debug('parse', unparsedReal);

	if (ff.handleInherit()) {
		return ff;
	}

	var genericCount = 0;
	var genericWasLast = false;
	var keepGoing = true;

	while (keepGoing) {
		// Match fontFamilyGenericName first so we know if a special
		// keyword-based font name was used
		var result = fontFamilyGenericName.parse(ff.unparsed, parser, ff);

		if (result) {
			genericCount ++;
			genericWasLast = true;
		} else {
			result = fontFamilyName.parse(ff.unparsed, parser, ff);
			genericWasLast = false;
		}

		if (! result) {
			return null;
		}

		ff.add(result);
		ff.unparsed = result.unparsed;

		if (! ff.unparsed.isTypeContent('OPERATOR', ',')) {
			keepGoing = false;
		} else {
			ff.add(ff.unparsed.advance());
		}
	}

	if (! genericWasLast | genericCount != 1) {
		ff.addWarning('font_family_one_generic_at_end', ff.firstToken());
	}

	return ff;
};
