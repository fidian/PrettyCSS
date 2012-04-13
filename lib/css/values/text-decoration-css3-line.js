/* <text-decoration-css3-line>
 *
 * Supporting object to make text-decoration-css3 easier
 * 
 * none | [ underline || overline || line-through ]
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var TextDecorationCss3Line = base.baseConstructor();

util.extend(TextDecorationCss3Line.prototype, base.base, {
	name: "text-decoration-css3-line"
});

exports.parse = function (unparsedReal, bucket, container) {
	var tdl = new TextDecorationCss3Line(bucket, container, unparsedReal);
	tdl.debug('parse', unparsedReal);

	if (tdl.unparsed.isContent('none')) {
		tdl.add(tdl.unparsed.advance());
		return tdl;
	}

	var hits = tdl.unparsed.matchAnyOrder([ 'underline', 'overline', 'line-through' ], tdl);

	if (! hits) {
		return null;
	} 

	return tdl;
};
