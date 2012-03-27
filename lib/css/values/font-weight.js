/* <font-weight>
 *
 * CSS1:  normal | bold | bolder | lighter
 * CSS1:  100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
 * CSS2:  inherit
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var FontSize = base.baseConstructor();

// TODO:  "normal" == "400" and "bold" == "700"
util.extend(FontSize.prototype, base.base, {
	name: "font-weight",

	allowed: [
		{
			validation: [],
			values: [ 
				'normal',
				'bold',
				'bolder',
				'lighter',
				base.makeRegexp('[0-9]00')
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

exports.parse = base.simpleParser(FontSize);
