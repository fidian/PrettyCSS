/* <page-marks>
 *
 * CSS2: [ crop || cross ] | none | inherit
 *
 * Not valid in CSS2.1
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "page-marks"
});


exports.parse = function (unparsedReal, bucket, container) {
	var v = new Val(bucket, container, unparsedReal);
	v.debug('parse', unparsedReal);

	if (v.handleInherit()) {
		return v;
	}

	var hits = v.unparsed.matchAnyOrder([
		'crop',
		'cross'
	], v);

	if (! hits) {
		if (v.unparsed.isContent('none')) {
			v.add(v.unparsed.advance());
			hits = true;
		}
	}

	if (! hits) {
		v.debug('parse fail');
		return null;
	}

	validate.call(v, 'minimumCss', v.firstToken(), 2);
	v.debug('parse success');
	return v;
};
