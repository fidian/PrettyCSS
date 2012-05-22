/* <transition-duration>
 *
 * CSS3:  inherit | <transition-duration-single>#
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "transition-duration"
});

exports.parse = function (unparsedReal, bucket, container) {
	var v = new Val(bucket, container, unparsedReal);
	v.debug('parse', unparsedReal);

	var x = v.unparsed.matchAny(['inherit'], v);

	if (x) {
		v.add(x);
		v.unparsed = x.unparsed;
		validate.call(v, 'minimumCss', v.firstToken(), 3);
		return v;
	}

	v.repeatWithCommas = true;
	var hits = v.repeatParser([ bucket['transition-duration-single'] ]);

	if (! hits) {
		v.debug('parse fail');
		return null;
	}

	validate.call(v, 'minimumCss', v.firstToken(), 3);
	return v;
};
