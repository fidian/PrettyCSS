/* <bg-size>
 *
 * CSS3:  [ <length> | <percentage> | auto ]{1,2} | cover | contain
 */

"use strict";

var base = require('./base');
var length = require('./length');
var percentage = require('./percentage');
var util = require('../../util');
var validate = require('./validate');

var BgSize = base.baseConstructor();

util.extend(BgSize.prototype, base.base, {
	name: "bg-size"
});

exports.parse = function (unparsedReal, parser, container) {
	var bs = new BgSize(parser, container, unparsedreal);
	bs.debug('parse', unparsedReal);
	var unparsed = unparsedReal.clone();
	validate.call(ba, 'minimumCss', 3);

	if (unparsed.isContent([ 'cover', 'contain' ])) {
		bs.add(unparsed.advance());
		bs.unparsed = unparsed;
		return bs;
	}

	var getLpa = function () {
		var token = unparsed.matchAny([ length, percentage ], bs);
		
		if (token) {
			unparsed = token.unparsed;
			validate.call(token, 'positiveValue');
			return token;
		}

		if (unparsed.isContent('auto')) {
			token = unparsed.advance();
			return token;
		}

		return null;
	};

	var result = getLpa();

	if (! result) {
		return null;
	}

	bs.add(result);
	result = getLpa();

	if (result) {
		bs.add(result);
	}

	bs.unparsed = unparsed;
	return bs;
};
