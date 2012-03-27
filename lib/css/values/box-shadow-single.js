/* <box-shadow-single>
 *
 * Used by box-shadow for a single shadow definition
 *
 * CSS3:  inherit | [ inset? && [ <length>{2,4} && <color>? ] ]
 */

"use strict";

var base = require('./base');
var color = require('./color');
var length = require('./length');
var util = require('../../util');
var validate = require('./validate');

var BoxShadowSingle = base.baseConstructor();

util.extend(BoxShadowSingle.prototype, base.base, {
	name: "box-shadow-single"
});


exports.parse = function (unparsedReal, parser, container) {
	var bss = new BoxShadowSingle(parser, container, unparsedReal);
	bss.debug('parse', unparsedReal);
	var unparsed = unparsedReal.clone();
	var insetFound = false;
	validate.call(bss, 'minimumCss', 3);

	if (bss.handleInherit()) {
		return bss;
	}

	if (unparsed.isContent('inset')) {
		insetFound = true;
		bss.add(unparsed.advance());
	}

	var c = color.parse(unparsed, parser, bss);

	if (c) {
		bss.add(c);
		unparsed = c.unparsed;
	}

	var lengths = bss.repeatparser([ length ], 4);

	if (lengths < 4) {
		bss.debug('parse fail');
		return null;
	}

	if (! c) {
		c = color.parse(unparsed, parser, bss);

		if (c) {
			bss.add(c);
			unparsed = c.unparsed;
		}
	}

	if (! insetFound && unparsed.isContent('inset')) {
		bss.add(unparsed.advance());
	}

	bss.warnIfInherit();
	bss.unparsed = unparsed;
	bss.debug('parse success', bss.unparsed);
	return bss;
};
