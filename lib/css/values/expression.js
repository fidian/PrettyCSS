/* <expression>
 *
 * expression( ANYTHING* )
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "expression"
});


exports.parse = function (unparsedReal, bucket, container) {
	var v = new Val(bucket, container, unparsedReal);
	v.debug('parse', v.unparsed);

	if (! v.unparsed.isTypeContent('FUNCTION', 'expression(')) {
		v.debug('parse fail - function');
		return null;
	}

	var depth = 1;
	v.add(v.unparsed.advance());

	while (v.unparsed.length() && depth) {
		if (v.unparsed.isType('FUNCTION') || v.unparsed.isTypeContent('CHAR', '(')) {
			depth ++;
		} else if (v.unparsed.isTypeContent('PAREN_CLOSE', ')')) {
			depth --;
		}

		v.add(v.unparsed.advance());
	}

	validate.call(v, 'browserOnly', v.firstToken(), 'ie');
	validate.call(v, 'browserUnsupported', v.firstToken(), 'ie8');
	v.debug('parse success');
	return v;
};
