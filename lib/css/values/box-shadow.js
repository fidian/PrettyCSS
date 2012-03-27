/* <box-shadow>
 *
 * CSS3:  inherit | none | <box-shadow-single> [ , <box-shadow-single> ]*
 */

"use strict";

var base = require('./base');
var boxShadowSingle = require('./box-shadow-single');
var util = require('../../util');
var validate = require('./validate');

var BoxShadow = base.baseConstructor();

util.extend(BoxShadow.prototype, base.base, {
	name: "box-shadow"
});

exports.parse = function (unparsedReal, parser, container) {
	var bs = new BoxShadow(parser, container, unparsedReal);
	var unparsed = unparsedReal.clone();
	bs.debug('parse', unparsedReal);
	validate.call(bs, 'minimumCss', 3);
	var result = unparsed.matchAny([ 'inherit', 'none' ], bs);

	if (result) {
		bs.add(result);
		bs.unparsed = result.unparsed;
		return bs;
	}

	if (! bs.repeatParser([ boxShadowSingle ])) {
		return null;
	}

	bs.warnIfInherit();
	return bs;
};
