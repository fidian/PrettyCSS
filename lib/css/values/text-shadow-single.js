/* <text-shadow-single>
 *
 * CSS3: none | [ <length>{2,3} && <color>? ]#
 * 
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var TextShadowSingle = base.baseConstructor();

util.extend(TextShadowSingle.prototype, base.base, {
	name: "text-shadow-single"
});


exports.parse = function (unparsedReal, bucket, container) {
	var tss = new TextShadowSingle(bucket, container, unparsedReal);
	tss.debug('parse', unparsedReal);
	var noneFound = false;
	validate.call(tss, 'minimumCss', tss.firstToken(), 3);

	if (tss.handleInherit(function () {})) {
		return tss;
	}

	if (tss.unparsed.isContent('none')) {
		noneFound = true;
		tss.add(tss.unparsed.advance());
		return tss;
	}

	var c = bucket['color'].parse(tss.unparsed, bucket, tss);

	if (c) {
		tss.add(c);
		tss.unparsed = c.unparsed;
	}

	var lengths = tss.repeatParser([ bucket['length'] ], 3);

	if (lengths < 2) {
		tss.debug('parse fail');
		return null;
	}

	if (! c) {
		c = bucket['color'].parse(tss.unparsed, bucket, tss);

		if (c) {
			tss.add(c);
			tss.unparsed = c.unparsed;
		}
	}

	if (! noneFound && tss.unparsed.isContent('none')) {
		tss.add(tss.unparsed.advance());
	}

	tss.warnIfInherit();
	tss.debug('parse success', tss.unparsed);
	return tss;
};
