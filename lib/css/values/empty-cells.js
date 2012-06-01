/* <empty-cells>
 *
 * CSS2: show | hide | inherit
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "empty-cells",

	allowed: [
		{
			validation: [
				validate.minimumCss(2)
			],
			values: [
				'show',
				'hide',
				'inherit'
			]
		}
	]
});

exports.parse = base.simpleParser(Val);
