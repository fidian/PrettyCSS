/* font-variant
 *
 * CSS1:  [ normal | small-caps ]
 * CSS2:  inherit
 *   The above matches <font-variant-css21>
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

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "font-variant"
});


exports.parse = function (unparsedReal, bucket, container) {
	var v = new Val(bucket, container, unparsedReal);
	v.debug('parse', unparsedReal);

	var css21 = bucket['font-variant-css21'].parse(v.unparsed, bucket, v);

	if (css21) {
		v.add(css21);
		v.unparsed = css21.unparsed;

		if (v.firstToken().content.toLowerCase() == 'inherit') {
			validate.call(v, 'minimumCss', v.firstToken(), 2);
		}
	
		v.debug('parse success - css21', v.unparsed);
		return v;
	}

	var hits = v.unparsed.matchAnyOrder([
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
	], v);

	if (! hits) {
		v.debug('parse fail');
		return null;
	}

	validate.call(v, 'minimumCss', v.firstToken(), 3);
	v.debug('parse success', v.unparsed);
	return v;
};
