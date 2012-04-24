/* <font-face-format>
 *
 * format( [ WS? STRING WS? ]# )
 */

"use strict";

var base = require('./base');
var util = require('../../util');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "font-face-format"
});


exports.parse = function (unparsedReal, bucket, container) {
	var v = new Val(bucket, container, unparsedReal);
	v.debug('parse', v.unparsed);
	v.isFunction = true;  // Switches the toString() method

	if (! v.unparsed.isTypeContent('FUNCTION', 'format(')) {
		v.debug('parse fail - function');
		return null;
	}

	v.add(v.unparsed.advance());

	if (! v.unparsed.isType('STRING')) {
		v.debug('parse fail - string 1');
		return null;
	}

	v.add(v.unparsed.advance());

	while (v.unparsed.isTypeContent('OPERATOR', ',')) {
		v.unparsed.advance();

		if (! v.unparsed.isType('STRING')) {
			v.debug('parse fail - string 2');
			return null;
		}

		v.add(v.unparsed.advance());
	}

	if (! v.unparsed.isTypeContent('PAREN_CLOSE', ')')) {
		v.debug('parse fail - paren close');
		return null;
	}

	v.unparsed.advance();

	v.debug('parse success');
	return v;
};
