/* Wrapper around value parsers
 *
 * It doesn't change the value parser, but just adds warnings or suggestions
 */

"use strict";

exports.deprecated = function (realParser, useInstead) {
	return function (unparsedReal, bucket, container) {
		var obj = realParser(unparsedReal, bucket, container);

		if (obj) {
			validate.call(obj, 'deprecated', bucket.propertyToken, useInstead);
		}

		return obj;
	};
};
