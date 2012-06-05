/* border-image-slice
 *
 * CSS3:  [ <number> | <percentage> ]{1,4} && fill?
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "border-image-slice"
});

exports.parse = function (unparsed, bucket, container) {
	var v = new Val(bucket, container, unparsed);
	v.debug('parse', unparsed);
	var didFill = false;

	if (v.unparsed.isContent('inherit')) {
		v.add(v.unparsed.advance());
		validate.call(v, 'minimumCss', v.firstToken(), 3);
		return v;
	}

	if (v.unparsed.isContent('fill')) {
		didFill = true;
		v.add(v.unparsed.advance());
	}

	var hits = v.repeatParser([
		bucket['number'],
		bucket['percentage']
	], 4);

	if (! hits) {
		v.debug('parse fail');
		return null;
	}

	if (! didFill && v.unparsed.isContent('fill')) {
		didFill = true;
		v.add(v.unparsed.advance());
	}

	validate.call(v, 'minimumCss', v.firstToken(), 3);
	v.debug('parse success');
	return v;
};
