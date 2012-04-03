/* <text-shadow>
 *
 * CSS3: none | [ <length>{2,3} && <color>? ]#
 * 
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var TextShadow = base.baseConstructor();

util.extend(TextShadow.prototype, base.base, {
	name: "text-shadow"
});


exports.parse = function (unparsedReal, bucket, container) {
	var ts = new TextShadow(bucket, container, unparsedReal);
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

	var c = bucket['color'].parse(ts.unparsed, bucket, ts);

	if (c) {
		ts.add(c);
		ts.unparsed = c.unparsed;
	}

	var lengths = ts.repeatParser([ bucket['length'] ], 3);

	if (lengths < 2) {
		ts.debug('parse fail');
		return null;
	}

	if (! c) {
		c = bucket['color'].parse(ts.unparsed, bucket, ts);

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
