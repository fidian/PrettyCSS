/* <transition-timing-function>
 *
 * CSS3:  inherit | none | <transition-timing-function-single>#
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "transition-triming-function"
});

exports.parse = function (unparsedReal, bucket, container) {
	var v = new Val(bucket, container, unparsedReal);
	v.debug('parse', unparsedReal);

	if (v.unparsed.matchAny(['inherit', 'none'], v)) {
		validate.call(v, 'minimumCss', v.firstToken(), 3);
		return v;
	}

	v.repeatWithCommas = true;
	var hits = v.repeatParser([ bucket['transition-timing-function-single'] ]);

	if (! hits) {
		v.debug('parse fail');
		return null;
	}

	validate.call(v, 'minimumCss', v.firstToken(), 3);
	return v;
};
