/* <linear-gradient>
 *
 * CSS3: linear-gradient ( [ [ <angle> | to <side-or-corner> ] , ]? <color-stop># )
 *
 * TODO: If "to" is missing and it has <side-or-corner>, autocorrect.  Draft
 * http://www.w3.org/TR/2011/WD-css3-images-20110712/#linear-gradients
 * is the last without the "to" keyword.
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "linear-gradient"
});

exports.parse = function (unparsedReal, bucket, container) {
	var v = new Val(bucket, container, unparsedReal);
	v.debug('parse', v.unparsed);
	v.isFunction = true;
	v.repeatWithCommas = true;
	var hits;
	var e;

	if (! v.unparsed.isTypeContent('FUNCTION', 'linear-gradient(')) {
		v.debug('parse fail - function');
		return null;
	}

	v.add(v.unparsed.advance());

	// This part is optional
	e = v.unparsed.matchAny([
		bucket['angle'],
		bucket['to-side-or-corner']
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
