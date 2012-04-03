/* <border-color>
 *
 * CSS1:  <color>{1,4}
 * CSS2:  <color>{1,4} | transparent | inherit
 * CSS2.1:  [ <color> | transparent ]{1,4} | inherit
 * CSS3:  <color> | inherit     transparent is part of <color>
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var BorderColor = base.baseConstructor();

util.extend(BorderColor.prototype, base.base, {
	name: "border-color"
});

exports.parse = function (unparsedReal, bucket, container) {
	var bc = new BorderColor(bucket, container, unparsedReal);
	bc.debug('parse', unparsedReal);

	if (bc.handleInherit()) {
		return bc;
	}

	var hits = bc.repeatParser([ bucket['border-color-single'] ], 4);

	if (! hits) {
		bc.debug('parse fail');
		return null;
	}

	// Determine minimum CSS level.  If the value is "transparent",
	// it could be just CSS level 2.  In this case, the <color> or
	// <border-color-single> objects could have added a minimum CSS
	// level of 2.1.  Remove that by starting all over and reparsing
	// as just the string "transparent"
	if (hits == 1 && bc.firstToken().content.toLowerCase() == "transparent") {
		bc = new BorderColor(bucket, container, unparsedReal);
		bc.debug("reparse as transparent");
		validate.call(bc, 'minimumCss', bc.firstToken(), 2);
		bc.add(bc.unparsed.advance());
		return bc;
	}

	bc.warnIfInherit();
	return bc;
};
