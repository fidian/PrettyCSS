/* font-face-font-variant
 *
 * Note:  inherit is not allowed
 *
 * CSS2:  [ normal | small-caps ]#
 *   This matches <font-variant-css21>
 * CSS3:  normal |
 *        [ <font-face-common-lig-values> ||
 *          <font-face-discretionary-lig-values> ||
 *          <font-face-historical-lig-values> ||
 *          <font-face-contextual-lig-values> ||
 *          <font-face-stylistic> ||
 *          historical-forms ||
 *          <font-face-styleset> ||
 *          <font-face-character-variant> ||
 *          <font-face-swash> ||
 *          <font-face-ornaments> ||
 *          <font-face-annotation> ||
 *          ruby ||
 *          <font-face-caps-values> ||
 *          <font-face-numeric-figure-values> ||
 *          <font-face-numeric-spacing-values> ||
 *          <font-face-numeric-fraction-values> ||
 *          slashed-zero ||
 *          <font-face-east-asian-variant-values> ||
 *          <font-face-east-asian-width-values> ]
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var FontFaceFontVariant = base.baseConstructor();

util.extend(FontFaceFontVariant.prototype, base.base, {
	name: "font-face-font-variant"
});


exports.parse = function (unparsedReal, bucket, container) {
	var fffv = new FontFaceFontVariant(bucket, container, unparsedReal);
	fffv.debug('parse', unparsedReal);

	fffv.repeatWithCommas = true;
	var hits = fffv.repeatParser(bucket['font-variant-css21']);

	if (hits) {
		fffv.fontValidation(hits);
		fffv.debug('parse success - css2', fffv.unparsed);
		return fffv;
	}

	fffv = new FontFaceFontVariant(bucket, container, unparsedReal);
	hits = fffv.unparsed.matchAnyOrder([
		// Normal was already parsed
		bucket['font-face-common-lig-values'],
		bucket['font-face-discretionary-lig-values'],
		bucket['font-face-historical-lig-values'],
		bucket['font-face-contextual-lig-values'],
		bucket['font-face-stylistic'],
		'historical-forms',
		bucket['font-face-styleset'],
		bucket['font-face-character-variant'],
		bucket['font-face-swash'],
		bucket['font-face-ornaments'],
		bucket['font-face-annotation'],
		'ruby',
		bucket['font-face-caps-values'],
		bucket['font-face-numeric-figure-values'],
		bucket['font-face-numeric-spacing-values'],
		bucket['font-face-numeric-fraction-values'],
		'slashed-zero',
		bucket['font-face-east-asian-variant-values'],
		bucket['font-face-east-asian-width-values']
	], fffv);

	if (! hits) {
		fffv.debug('parse fail');
		return null;
	}

	validate.call(fffv, 'minimumCss', fffv.firstToken(), 3);
	fffv.warnIfInherit();
	fffv.debug('parse success - css3', fffv.unparsed);
	return fffv;
};
