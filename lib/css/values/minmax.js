/* <minmax>
 *
 * Used by <col-width>
 * minmax( WS? p WS? , WS? q WS? )
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Minmax = base.baseConstructor();

util.extend(Minmax.prototype, base.base, {
	name: "minmax"
});


exports.parse = function (unparsed, bucket, container) {
	var minmax = new Minmax(bucket, container, unparsed);
	minmax.debug('parse', unparsed);

	if (! minmax.functionParser('minmax(',
		[ bucket['length'], "max-content", "min-content", "*" ],
		[ bucket['length'], "max-content", "min-content", "*" ])) {
		return null;
	}

	var P = minmax.list[1];
	var Q = minmax.list[2];

	if (P.name && P.name == 'length' && Q.name && Q.name == 'length') {
		// CSS spec says if P > Q, assume minmax(P,P)
		// TODO:  Find a way to compare across units
		if (P.getUnit() == Q.getUnit() && P.getValue() > Q.getValue()) {
			minmax.addWarning('minmax-p-q', minmax.firstToken());
		}
	}

	minmax.debug('parse success', minmax.unparsed);
	validate.call(minmax, 'minimumCss', minmax.firstToken(), 3);
	return minmax;
};
