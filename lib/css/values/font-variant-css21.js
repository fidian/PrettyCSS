/* <font-variant-css21>
 *
 * CSS1: normal | small-caps
 * CSS2: inherit
 *
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var FontVariantCss21 = base.baseConstructor();

util.extend(FontVariantCss21.prototype, base.base, {
	name: "font-variant-css21",

	allowed: [
		{
			validation: [],
			values: [ 
				'normal',
				'small-caps'
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

exports.parse = base.simpleParser(FontVariantCss21);
