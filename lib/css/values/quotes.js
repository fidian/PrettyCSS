/* <quotes>
 *
 * CSS2: <quotes-single>+ | none | inherit
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "quotes"
});

exports.parse = function (unparsedReal, bucket, container) {
	var v = new Val(bucket, container, unparsedReal);
	v.debug('parse start');

	if (v.unparsed.isContent([ 'none', 'inherit' ])) {
		v.add(v.unparsed.advance());
		validate.call(v, 'minimumCss', v.firstToken(), 2);
		v.debug('parse success');
		return v;
	}

	var hits = v.repeatParser([ bucket['quotes-single'] ]);

	if (! hits) {
		v.debug('parse fail');
		return null;
	}

	validate.call(v, 'minimumCss', v.firstToken(), 2);
	v.debug('parse success');
	return v;
};
