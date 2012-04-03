/* <minmax>
 *
 * Used by <col-width>
 * minmax( WS? p WS? , WS? q WS? )
 */

"use strict";

var base = require('./base');
var util = require('../../util');

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

	// TODO:  If P > Q then assume minmax(P,P) - add warning
	minmax.debug('parse success', minmax.unparsed);
	validate.call(minmax, 'minimumCss', minmax.firstToken(), 3);
	return minmax;
};
