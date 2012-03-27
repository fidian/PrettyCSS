/* <text-shadow>
 *
 * CSS3: none | [ <length>{2,3} && <color>? ]#
 * 
 */

"use strict";

var base = require('./base');
var color = require('./color');
var length = require('./length');
var util = require('../../util');
var validate = require('./validate');

var TextShadow = base.baseConstructor();

util.extend(TextShadow.prototype, base.base, {
	name: "text-shadow"
});


exports.parse = function (unparsedReal, parser, container) {
	var ts = new TextShadow(parser, container, unparsedReal);
	ts.debug('parse', unparsedReal);
	var unparsed = unparsedReal.clone();
	var noneFound = false;
	validate.call(ts, 'minimumCss', 3);

	if (ts.handleInherit()) {
		return ts;
	}

	if (unparsed.isContent('none')) {
		noneFound = true;
		ts.add(unparsed.advance());
	}

	var c = color.parse(unparsed, parser, ts);

	if (c) {
		ts.add(c);
		unparsed = c.unparsed;
	}

	var lengths = ts.repeatParser([ length ], 4);

	if (lengths < 4) {
		ts.debug('parse fail');
		return null;
	}

	if (! c) {
		c = color.parse(unparsed, parser, ts);

		if (c) {
			ts.add(c);
			unparsed = c.unparsed;
		}
	}

	if (! insetFound && unparsed.isContent('none')) {
		ts.add(unparsed.advance());
	}

	ts.warnIfInherit();
	ts.unparsed = unparsed;
	ts.debug('parse success', ts.unparsed);
	return ts;
};
