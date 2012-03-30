/* <font-family>
 *
 * CSS1:  [ <font-family-name> | <font-family-generic-name> ]i#
 * CSS2:  inherit
 */

"use strict";

var base = require('./base');
var fontFamilyGenericName = require('./font-family-generic-name');
var fontFamilyName = require('./font-family-name');
var util = require('../../util');
var validate = require('./validate');

var FontFamily = base.baseConstructor();

util.extend(FontFamily.prototype, base.base, {
	name: "font-family"
});

exports.parse = function (unparsedReal, parser, container) {
	var ff = new FontFamily(parser, container, unparsedReal);
	ff.debug('parse', unparsedReal);

	if (ff.handleInherit()) {
		return ff;
	}

	var genericCount = 0;
	var genericWasLast = false;
	var keepGoing = true;
	ff.repeatWithCommas = true;
	var hits = ff.repeatParser([ fontFamilyGenericName, fontFamilyName ]);

	if (! hits) {
		return null;
	}

	ff.list.forEach(function (item) {
		if (item.name != 'font-family-generic-name') {
			genericWasLast = false;
		} else {
			genericCount ++;
			genericWasLast = true;
		}
	});

	if (! genericWasLast || genericCount != 1) {
		ff.addWarning('font_family_one_generic_at_end', ff.firstToken());
	}

	return ff;
};
