/* <text-decoration-line>
 *
 * CSS1:  none | [ underline || overline || line-through ]
 * CSS2:  inherit
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var TextDecorationLine = base.baseConstructor();

util.extend(TextDecorationLine.prototype, base.base, {
	name: "text-decoration-line"
});

exports.parse = function (unparsedReal, bucket, container) {
	var tdl = new TextDecorationLine(bucket, container, unparsedReal);
	var unparsed = unparsedReal.clone();
	tdl.debug('parse', unparsedReal);
	validate.call(tdl, 'minimumCss', tdl.firstToken(), 3);
	var result = unparsed.matchAny([ 'inherit', 'none' ], tdl);

	if (result) {
		tdl.add(result);
		tdl.unparsed = result.unparsed;
		return tdl;
	}

	var hits = unparsed.matchAnyOrder([ 'underline', 'overline', 'line-through' ], tdl);

	if (! hits) {
		return null;
	} 

	return tdl;
};
