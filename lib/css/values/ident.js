/* <ident>
 *
 * Basic data type used in simple parsers
 */

"use strict";

var base = require('./base');
var util = require('../../util');

var Ident = base.baseConstructor();

util.extend(Ident.prototype, base.base, {
	name: "ident"
});


exports.parse = function (unparsedReal, bucket, container) {
	var ident = new Ident(bucket, container, unparsedReal);
	ident.debug('parse', unparsedReal);

	if (ident.unparsed.isType('IDENT')) {
		ident.add(ident.unparsed.advance());
		return ident;
	}

	return null;
};
