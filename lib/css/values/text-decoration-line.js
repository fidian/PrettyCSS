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

exports.parse = function (unparsedReal, parser, container) {
	var tdl = new TextDecorationLine(parser, container, unparsedReal);
	var unparsed = unparsedReal.clone();
	tdl.debug('parse', unparsedReal);
	validate.call(tdl, 'minimumCss', 3);
	var result = unparsed.matchAny([ 'inherit', 'none' ]);

	if (result) {
		tdl.add(result);
		tdl.unparsed = result.unparsed;
		return tdl;
	}

	result = unparsed.matchAnyOrder([ 'underline', 'overline', 'line-through' ], tdl);

	if (! result.matches.length) {
		return null;
	} 

	result.matches.forEach(function (tokenOrObject) {
		tdl.add(tokenOrObject);
	});
	tdl.unparsed = result.unparsed;
	return tdl;
};
