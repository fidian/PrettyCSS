/* <string>
 *
 * Basic data type used in simple parsers
 */

"use strict";

var base = require('./base');
var util = require('../../util');

var Str = base.baseConstructor();

util.extend(Str.prototype, base.base, {
	name: "string"
});


exports.parse = function (unparsedReal, bucket, container) {
	var str = new Str(bucket, container, unparsedReal);
	str.preserveCase = true;
	str.debug('parse', unparsedReal);

	if (str.unparsed.isType('STRING')) {
		str.add(str.unparsed.advance());
		return str;
	}

	return null;
};
