/* rgba( {w} {n} %? {w} , {w} {n} %? {w} , {w} {n} %? {w} , {w} {n} {w})
 *
 * Used to define colors
 */

"use strict";

var base = require('./base');
var util = require('../../util');

var RGBA = base.baseConstructor();

util.extend(RGBA.prototype, base.base, {
	name: "rgba"
});

exports.parse = function (unparsed, bucket, container) {
	var rgba = new RGBA(bucket, container, unparsed);
	rgba.debug('parse', unparsed);
	
	if (! rgba.functionParser('rgba(', 
		[ bucket['number'], bucket['percentage'] ],
		[ bucket['number'], bucket['percentage'] ],
		[ bucket['number'], bucket['percentage'] ],
		bucket['number'])) {
		return null;
	}

	rgba.validateColorValues();
	rgba.debug('parse success');
	return rgba;
};
