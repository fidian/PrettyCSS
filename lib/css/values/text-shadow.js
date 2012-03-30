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
	var noneFound = false;
	validate.call(ts, 'minimumCss', ts.firstToken(), 3);

	if (ts.handleInherit()) {
		return ts;
	}

	if (ts.unparsed.isContent('none')) {
		noneFound = true;
		ts.add(ts.unparsed.advance());
		return ts;
	}

	var c = color.parse(ts.unparsed, parser, ts);

	if (c) {
		ts.add(c);
		ts.unparsed = c.unparsed;
	}

	var lengths = ts.repeatParser([ length ], 3);

	if (lengths < 2) {
		ts.debug('parse fail');
		return null;
	}

	if (! c) {
		c = color.parse(ts.unparsed, parser, ts);

		if (c) {
			ts.add(c);
			ts.unparsed = c.unparsed;
		}
	}

	if (! noneFound && ts.unparsed.isContent('none')) {
		ts.add(ts.unparsed.advance());
	}

	ts.warnIfInherit();
	ts.debug('parse success', ts.unparsed);
	return ts;
};
