/* <overflow-dimension>
 *
 * Used for the overflow-x and overflow-y properties
 *
 * CSS3:  visible | hidden | scroll | auto | no-display | no-content | inherit
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var OverflowDimension = base.baseConstructor();

util.extend(OverflowDimension.prototype, base.base, {
	name: "overflow-dimension",

	allowed: [
		{
			validation: [
				validate.minimumCss(3)
			],
			values: [
				"visible",
				"hidden",
				"scroll",
				"auto",
				"no-display",
				"no-content",
				"inherit"
			]
		}
	]
});

exports.parse = base.simpleParser(OverflowDimension);
