/* <border-image-outset-single>
 *
 * CSS3:  <length> | <number>
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "border-image-outset-single",

	allowed: [
		{
			validation: [
				validate.minimumCss(3)
			],
			valueObjects: [
				'length',
				'number'
			]
		}
	]
});

exports.parse = base.simpleParser(Val);
