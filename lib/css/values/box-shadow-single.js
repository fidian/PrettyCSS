/* <box-shadow-single>
 *
 * Used by box-shadow for a single shadow definition
 *
 * CSS3:  inherit | [ inset? && [ <length>{2,4} && <color>? ] ]
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var BoxShadowSingle = base.baseConstructor();

util.extend(BoxShadowSingle.prototype, base.base, {
	name: "box-shadow-single"
});


exports.parse = function (unparsedReal, bucket, container) {
	var bss = new BoxShadowSingle(bucket, container, unparsedReal);
	bss.debug('parse', unparsedReal);
	var insetFound = false;
	validate.call(bss, 'minimumCss', bss.firstToken(), 3);

	if (bss.handleInherit()) {
		return bss;
	}

	if (bss.unparsed.isContent('inset')) {
		insetFound = true;
		bss.add(bss.unparsed.advance());
	}

	var c = bucket['color'].parse(bss.unparsed, bucket, bss);

	if (c) {
		bss.add(c);
		bss.unparsed = c.unparsed;
	}

	var lengths = bss.repeatParser([ bucket['length'] ], 4);

	if (lengths < 2) {
		bss.debug('parse fail');
		return null;
	}

	if (! c) {
		c = bucket['color'].parse(bss.unparsed, bucket, bss);

		if (c) {
			bss.add(c);
			bss.unparsed = c.unparsed;
		}
	}

	if (! insetFound && bss.unparsed.isContent('inset')) {
		bss.add(bss.unparsed.advance());
	}

	bss.warnIfInherit();
	bss.debug('parse success', bss.unparsed);
	return bss;
};
