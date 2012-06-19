/* <font-face-format>
 *
 * format( [ WS? STRING WS? ]# )
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

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

	if (v.unparsed.isType('STRING')) {
		v.add(v.unparsed.advance());
	} else if (v.unparsed.isType('IDENT') && v.bucket.options.autocorrect) {
		// the format must be quoted
		var original = v.unparsed.advance();
		var asString = original.clone();
		asString.content = '"' + asString.content + '"';
		asString.type = 'STRING';

		if (v.bucket.options.autocorrect) {
			validate.call(v, 'autoCorrect', original, asString.content);
			v.add(asString);
		} else {
			v.addWarning('invalid-value', original);
			v.add(original);
		}
	} else {
		v.debug('parse fail - string 1');
		return null;
	}


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
