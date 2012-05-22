/* <transform>
 *
 * CSS3:  inherit | none | <transform-function>+
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "transform"
});

exports.parse = function (unparsedReal, bucket, container) {
	var v = new Val(bucket, container, unparsedReal);
	v.debug('parse', unparsedReal);

	var x = v.unparsed.matchAny(['inherit', 'none'], v);

	if (x) {
		v.add(x);
		v.unparsed = x.unparsed;
		validate.call(v, 'minimumCss', v.firstToken(), 3);
		return v;
	}

	var hits = v.repeatParser([ bucket['transform-function'] ]);

	if (! hits) {
		v.debug('parse fail');
		return null;
	}

	validate.call(v, 'minimumCss', v.firstToken(), 3);
	return v;
};
