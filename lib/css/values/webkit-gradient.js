/* <webkit-gradient>
 *
 * -webkit-gradient(type, start_point, end_point, stop...)
 * -webkit-gradient(type, inner_center, inner_radius, outer_center, outer_radius, stop...)
 *
 * type = "linear" or "radial"
 * start_point, end_point = webkit-side-or-corner
 * stop = color-stop(<number>|<percentage>,<color>), from(<color>), or to(<color>) functions
 * inner_center, outer_center = <length> | <percentage> | <webkit-side-or-corner> | center
 * inner_radius, outer_radius = <length> | <percentage>
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "webkit-gradient"
});

exports.parse = function (unparsedReal, bucket, container) {
	var v = new Val(bucket, container, unparsedReal);
	v.debug('parse', v.unparsed);
	v.isFunction = true;
	v.repeatWithCommas = true;
	var hits;
	var e;

	if (! v.unparsed.isTypeContent('IDENT', '-webkit-gradient')) {
		v.debug('parse fail - function');
		return null;
	}

	v.add(v.unparsed.advance());

	if (! v.unparsed.isTypeContent('CHAR', '(')) {
		v.debug('parse fail - paren open');
		return null;
	}

	v.add(v.unparsed.advance());

	var doParameter = function (paramType) {
		if (! v.unparsed.isTypeContent('OPERATOR', ',')) {
			v.debug('parse fail - parameter comma');
			return false;
		}

		v.unparsed.advance(); // Commas are added back in automatically
		var e = bucket[paramType].parse(v.unparsed, bucket, v);

		if (! e) {
			v.debug('parse fail - parameter parse');
			return false;
		}

		v.add(e);
		v.unparsed = e.unparsed;
		return true;
	};

	if (v.unparsed.isContent('linear')) {
		v.add(v.unparsed.advance());

		if (! doParameter('webkit-side-or-corner')) {
			v.debug('parse fail - linear, first side or corner');
			return null;
		}

		if (! doParameter('webkit-side-or-corner')) {
			v.debug('parse fail - linear, second side or corner');
			return null;
		}
	} else if (v.unparsed.isContent('radial')) {
		v.add(v.unparsed.advance());

		if (! doParameter('webkit-gradient-center')) {
			v.debug('parse fail - radial, first center');
			return null;
		}

		if (! doParameter('length-percentage')) {
			v.debug('parse fail - radial, first length or percentage');
			return null;
		}

		if (! doParameter('webkit-gradient-center')) {
			v.debug('parse fail - radial, second center');
			return null;
		}

		if (! doParameter('length-percentage')) {
			v.debug('parse fail - radial, second length or percentage');
			return null;
		}
	} else {
		v.debug('parse fail - invalid type');
		return null;
	}

	var foundColor = false;

	while (v.unparsed.isTypeContent('OPERATOR', ',')) {
		v.unparsed.advance();
		e = bucket['webkit-color-stop'].parse(v.unparsed, bucket, v);

		if (! e) {
			v.debug('parse fail - bad color stop');
			return null;
		}

		v.add(e);
		v.unparsed = e.unparsed;
		foundColor = true;
	}

	if (! v.unparsed.isTypeContent('PAREN_CLOSE', ')')) {
		v.debug('parse fail - paren close', v.unparsed);
		return null;
	}

	v.unparsed.advance();  // Throw close paren away

	if (! foundColor) {
		v.debug('parse fail - no color stops');
		return null;
	}

	v.debug('parse success');
	return v;
};
