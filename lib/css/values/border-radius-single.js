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

	if (brs.handleInherit()) {
		return brs;
	}

	var result = unparsed.matchAny([ bucket['length'], bucket['percentage'] ], brs);
	
	if (! result) {
		return null;
	}

	validate.call(result, 'positiveValue');
	brs.add(result);
	unparsed = result.unparsed;

	result = unparsed.matchAny([ bucket['length'], bucket['percentage'] ], brs);

	if (result) {
		validate.call(result, 'positiveValue');
		brs.add(result);
		unparsed = result.unparsed;
	}

	brs.unparsed = unparsed;
	validate.call(brs, 'minimumCss', brs.firstToken(), 3);
	return brs;
};
