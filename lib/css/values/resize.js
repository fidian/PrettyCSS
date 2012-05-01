/* <resize>
 *
 * CSS3: none | both | horizontal | vertical | inherit
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "resize",

	allowed: [
		{
			validation: [
				validate.minimumCss(3)
			],
			values: [
				'none',
				'both',
				'horizontal',
				'vertical',
				'inherit'
			]
		}
	]
});

exports.parse = base.simpleParser(Val);
