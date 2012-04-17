/* Wrapper around value parsers
 *
 * It doesn't change the value parser, but just adds warnings or suggestions
 */

"use strict";

var simpleWarningFunction = function (warning) {
	return function (realParser, extra) {
		return function (unparsedReal, bucket, container) {
			var obj = realParser(unparsedReal, bucket, container);

			if (obj) {
				if ('undefined' != typeof useInstead) {
					warning += ':' + useInstead;
				}

				obj.addWarning(warning, bucket.propertyToken);
			}

			return obj;
		};
	};
};

exports.deprecated = simpleWarningFunction('deprecated');
exports.unofficial = simpleWarningFunction('unofficial');
