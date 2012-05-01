/* <webkit-linear-gradient>
 *
 * linear-gradient ( [ [ <angle> | <webkit-side-or-corner> ] , ]? <color-stop># )
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "webkit-linear-gradient"
});

exports.parse = function (unparsedReal, bucket, container) {
	var v = new Val(bucket, container, unparsedReal);
	v.debug('parse', v.unparsed);
	v.isFunction = true;
	v.repeatWithCommas = true;
	var hits;
	var e;

	if (! v.unparsed.isTypeContent('IDENT', '-webkit-linear-gradient')) {
		v.debug('parse fail - function');
		return null;
	}

	v.add(v.unparsed.advance());

	if (! v.unparsed.isTypeContent('CHAR', '(')) {
		v.debug('parse fail - paren open');
		return null;
	}

	v.add(v.unparsed.advance());

	// This part is optional
	e = v.unparsed.matchAny([
		bucket['angle'],
		bucket['webkit-side-or-corner']
	], v);

	if (e) {
		v.add(e);
		v.unparsed = e.unparsed;

		if (! v.unparsed.isTypeContent('OPERATOR', ',')) {
			v.debug('parse fail - comma');
		}

		v.unparsed.advance();  // Remove - added by toString()
	}

	hits = v.repeatParser([ bucket['color-stop'] ]);

	if (! hits) {
		v.debug('parse fail - colors');
		return null;
	}

	if (! v.unparsed.isTypeContent('PAREN_CLOSE', ')')) {
		v.debug('parse fail - paren close');
		return null;
	}

	v.unparsed.advance();  // Throw the close paren away
	validate.call(v, 'minimumCss', v.firstToken(), 3);
	v.debug('parse success');
	return v;
};
