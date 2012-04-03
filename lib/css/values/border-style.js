/* <border-style>
 *
 * CSS1:  <border-style-single>
 * CSS2:  inherit | hidden
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var BorderStyle = base.baseConstructor();

util.extend(BorderStyle.prototype, base.base, {
	name: "border-style",

	allowed: [
		{
			validation: [],
			valueObjects: [
				'border-style-single'
			]
		},
		{
			validation: [
				validate.minimumCss(2)
			],
			values: [
				"inherit",
				"hidden"
			]
		}
	]
});

exports.parse = base.simpleParser(BorderStyle);
