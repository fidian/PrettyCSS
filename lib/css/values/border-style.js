/* <border-style>
 *
 * CSS1:  <border-style-multiple>
 * CSS2:  <border-style-single> | inherit | hidden
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
				'border-style-multiple'
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
