/* <border-color-single>
 *
 * CSS1:  <color>
 * CSS2.1:  transparent | <color>
 */

"use strict";

var base = require('./base');
var color = require('./color');
var util = require('../../util');
var validate = require('./validate');

var BorderColorSingle = base.baseConstructor();

util.extend(BorderColorSingle.prototype, base.base, {
	name: "border-color-single",

	allowed: [
		{
			validation: [
				validate.minimumCss(2.1)
			],
			values: [
				"transparent"
			]
		},
		{
			validation: [],
			values: [
				color
			]
		}
	]
});

exports.parse = base.simpleParser(BorderColorSingle);
