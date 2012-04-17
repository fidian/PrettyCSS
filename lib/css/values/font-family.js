/* <font-family>
 *
 * CSS1:  [ <font-family-name> | <font-family-generic-name> ]#
 * CSS2:  inherit
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var FontFamily = base.baseConstructor();

util.extend(FontFamily.prototype, base.base, {
	name: "font-family"
});

exports.parse = function (unparsedReal, bucket, container) {
	var ff = new FontFamily(bucket, container, unparsedReal);
	ff.debug('parse', unparsedReal);

	if (ff.handleInherit()) {
		return ff;
	}

	var genericCount = 0;
	var genericWasLast = false;
	var keepGoing = true;
	ff.repeatWithCommas = true;
	var hits = ff.repeatParser([ bucket['font-family-generic-name'], bucket['font-family-name'] ]);

	if (! hits) {
		return null;
	}

	ff.list.forEach(function (item) {
		if (item.name != 'font-family-generic-name') {
			genericWasLast = false;
		} else {
			genericCount ++;
			genericWasLast = true;
		}
	});

	if (! genericWasLast || genericCount != 1) {
		ff.addWarning('font-family-one-generic', bucket.propertyToken);
	}

	ff.warnIfInherit();

	return ff;
};
