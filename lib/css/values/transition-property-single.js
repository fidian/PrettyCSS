/* <transition-property-single>
 *
 * CSS3:  all | <ident>
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "transition-property-single",

	allowed: [
		{
			validation: [
				validate.minimumCss(3)
			],
			values: [
				"all"
			],
			valueObjects: [
				'ident'
			]
		}
	]
});

exports.parse = base.simpleParser(Val);
