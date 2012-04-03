/* <box-shadow>
 *
 * CSS3:  inherit | none | <box-shadow-single>#
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var BoxShadow = base.baseConstructor();

util.extend(BoxShadow.prototype, base.base, {
	name: "box-shadow"
});

exports.parse = function (unparsedReal, bucket, container) {
	var bs = new BoxShadow(bucket, container, unparsedReal);
	var unparsed = unparsedReal.clone();
	bs.debug('parse', unparsedReal);
	validate.call(bs, 'minimumCss', bs.firstToken(), 3);

	if (bs.handleInherit(function () {})) {
		return bs;
	}

	if (bs.unparsed.isContent('none')) {
		bs.add(bs.unparsed.advance());
		return bs;
	}

	bs.repeatWithCommas = true;

	if (! bs.repeatParser([ bucket['box-shadow-single'] ])) {
		return null;
	}

	bs.warnIfInherit();
	return bs;
};
