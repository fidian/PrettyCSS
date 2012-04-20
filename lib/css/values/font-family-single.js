/* <font-family-single>
 *
 * CSS1:  [ <font-family-name> | <font-family-generic-name> ]
 */

"use strict";

var base = require('./base');
var util = require('../../util');

var FontFamilySingle = base.baseConstructor();

util.extend(FontFamilySingle.prototype, base.base, {
	name: "font-family-single",

	allowed: [
		{
			validation: [],
			valueObjects: [
				"font-family-name",
				"font-family-generic-name"
			]
		}
	]
});

exports.parse = base.simpleParser(FontFamilySingle);
