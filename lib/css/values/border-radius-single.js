/* <border-radius-single>
 *
 * CSS3:  [ <length> | <percentage> ]{1,2}
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var BorderRadiusSingle = base.baseConstructor();

util.extend(BorderRadiusSingle.prototype, base.base, {
	name: "border-radius-single"
});

exports.parse = function (unparsedReal, bucket, container) {
	var brs = new BorderRadiusSingle(bucket, container, unparsedReal);
	var unparsed = unparsedReal.clone();
	brs.debug('parse', unparsedReal);
	validate.call(brs, 'minimumCss', brs.firstToken(), 3);

	if (brs.handleInherit(function () {})) {
		return brs;
	}

	var result = unparsed.matchAny([ bucket['length'], bucket['percentage'] ], brs);
	
	if (! result) {
		return null;
	}

	validate.call(brs, 'positiveValue', result.firstToken());
	brs.add(result);
	unparsed = result.unparsed;

	result = unparsed.matchAny([ bucket['length'], bucket['percentage'] ], brs);

	if (result) {
		validate.call(brs, 'positiveValue', result.firstToken());
		brs.add(result);
		unparsed = result.unparsed;
	}

	brs.unparsed = unparsed;
	return brs;
};
