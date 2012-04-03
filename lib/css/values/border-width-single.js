/* <border-width-single>
 *
 * CSS1:  thin | medium | thick | <length>
 * CSS2:  inherit
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var BorderWidthSingle = base.baseConstructor();

util.extend(BorderWidthSingle.prototype, base.base, {
	name: "border-width-single",

	allowed: [
		{
			validation: [],
			values: [
				"thin",
				"medium",
				"thick"
			],
			valueObjects: [
				'length'
			]
		},
		{
			validation: [
				validate.minimumCss(2)
			],
			values: [
				"inherit"
			]
		}
	]
});

exports.parse = base.simpleParser(BorderWidthSingle);
